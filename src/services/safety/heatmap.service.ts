import axios from "axios";
import Config from "react-native-config";

export type HeatmapAudience = "women" | "children";

export type HeatmapPoint = {
  latitude: number;
  longitude: number;
  weight: number;
};

type IncidentDoc = {
  location?: string;
  severity?: string;
  incidentType?: string;
};

const GEOCODE_CACHE = new Map<string, { latitude: number; longitude: number } | null>();

const severityWeight = (severity?: string): number => {
  const s = (severity || "").toLowerCase();
  if (s === "critical") return 4;
  if (s === "high") return 3;
  if (s === "medium") return 2;
  return 1;
};

const parseDirectCoords = (location: string): { latitude: number; longitude: number } | null => {
  const m = location.trim().match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (!m) return null;
  const lat = Number(m[1]);
  const lng = Number(m[2]);
  if (!isFinite(lat) || !isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { latitude: lat, longitude: lng };
};

const geocodeLocation = async (
  location: string,
  apiKey: string,
): Promise<{ latitude: number; longitude: number } | null> => {
  const key = location.toLowerCase().trim();

  const cached = GEOCODE_CACHE.get(key);
  if (cached !== undefined) return cached;

  const direct = parseDirectCoords(location);
  if (direct) {
    GEOCODE_CACHE.set(key, direct);
    return direct;
  }

  const queries = [location, `${location}, Sri Lanka`, `${location}, Colombo, Sri Lanka`];

  for (const query of queries) {
    try {
      const { data } = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: { address: query, key: apiKey },
        timeout: 8000,
      });

      const geo = data?.results?.[0]?.geometry?.location;
      if (isFinite(geo?.lat) && isFinite(geo?.lng)) {
        const result = { latitude: Number(geo.lat), longitude: Number(geo.lng) };
        GEOCODE_CACHE.set(key, result);
        return result;
      }
    } catch {
      continue;
    }
  }

  GEOCODE_CACHE.set(key, null);
  return null;
};

const matchesAudience = (incidentType: string | undefined, audience: HeatmapAudience): boolean => {
  if (!incidentType) return false;
  const t = incidentType.toLowerCase();
  if (audience === "women") return t === "women" || t === "women & children";
  return t === "children" || t === "women & children";
};

const getApiBases = (): string[] => {
  const bases: string[] = [];

  const primary = (Config.API_BASE_URL || "").trim().replace(/\/+$/, "");
  if (primary) {
    bases.push(primary.endsWith("/api") ? primary : `${primary}/api`);
  }

  const portal = (Config.WEB_PORTAL_API_URL || "").trim().replace(/\/+$/, "");
  if (portal) {
    bases.push(portal.endsWith("/api") ? portal : `${portal}/api`);
  }

  if (bases.length === 0) bases.push("http://10.0.2.2:3001/api");
  return bases;
};

const validPoint = (p: HeatmapPoint): boolean =>
  isFinite(p.latitude) &&
  isFinite(p.longitude) &&
  p.latitude >= -90 &&
  p.latitude <= 90 &&
  p.longitude >= -180 &&
  p.longitude <= 180;

export type HeatmapLoadResult =
  | { ok: true; points: HeatmapPoint[] }
  | { ok: false; error: string };

export const loadHeatmapPoints = async (
  audience: HeatmapAudience,
  searchQuery?: string,
): Promise<HeatmapLoadResult> => {
  const apiBases = getApiBases();
  const googleMapsApiKey = (Config.GOOGLE_MAPS_API_KEY || "").trim();
  const errors: string[] = [];

  for (const apiBase of apiBases) {
    // ── Try /safety/heatmap (dedicated endpoint, already geocoded) ──────────
    try {
      const params: Record<string, string> = { audience };
      if (searchQuery) params.query = searchQuery;

      const { data, status } = await axios.get(`${apiBase}/safety/heatmap`, {
        params,
        timeout: 10000,
      });

      if (status === 200 && Array.isArray(data?.data?.points)) {
        const points: HeatmapPoint[] = data.data.points
          .map((p: any) => ({
            latitude: Number(p?.latitude),
            longitude: Number(p?.longitude),
            weight: Number(p?.weight ?? 1),
          }))
          .filter(validPoint);

        console.log(`[heatmap] ${apiBase}/safety/heatmap → ${points.length} points`);
        return { ok: true, points };
      }
    } catch (e) {
      const msg = axios.isAxiosError(e)
        ? `${apiBase}/safety/heatmap → ${e.code || e.message}`
        : `${apiBase}/safety/heatmap → ${e instanceof Error ? e.message : "unknown"}`;
      errors.push(msg);
    }

    // ── Try /incidents fallback + on-device geocoding ───────────────────────
    try {
      const { data, status } = await axios.get(`${apiBase}/incidents`, { timeout: 10000 });

      if (status !== 200 || !Array.isArray(data?.incidents)) continue;

      const incidents: IncidentDoc[] = data.incidents;

      const filtered = incidents.filter((incident) => {
        const location = (incident.location || "").trim();
        if (!location) return false;
        if (!matchesAudience(incident.incidentType, audience)) return false;
        if (!searchQuery) return true;
        return location.toLowerCase().includes(searchQuery.toLowerCase());
      });

      if (filtered.length === 0) return { ok: true, points: [] };

      if (!googleMapsApiKey) {
        return {
          ok: false,
          error: "GOOGLE_MAPS_API_KEY missing in .env — cannot geocode incident locations.",
        };
      }

      const uniqueLocations = [...new Set(filtered.map((i) => i.location!.trim()))];
      const coordMap = new Map<string, { latitude: number; longitude: number } | null>();

      await Promise.all(
        uniqueLocations.map(async (loc) => {
          const coords = await geocodeLocation(loc, googleMapsApiKey);
          coordMap.set(loc, coords);
        }),
      );

      const points: HeatmapPoint[] = filtered
        .map((incident) => {
          const coords = coordMap.get(incident.location!.trim());
          if (!coords) return null;
          return {
            latitude: coords.latitude,
            longitude: coords.longitude,
            weight: severityWeight(incident.severity),
          };
        })
        .filter((p): p is HeatmapPoint => p !== null);

      console.log(`[heatmap] ${apiBase}/incidents fallback → ${points.length} points`);
      return { ok: true, points };
    } catch (e) {
      const msg = axios.isAxiosError(e)
        ? `${apiBase}/incidents → ${e.code || e.message}`
        : `${apiBase}/incidents → ${e instanceof Error ? e.message : "unknown"}`;
      errors.push(msg);
    }
  }

  const hint = errors.length > 0
    ? `Could not reach backend:\n${errors.join("\n")}\n\nMake sure SafeLink_Dashboardd is running (npm run dev).`
    : "No API base URL configured. Check API_BASE_URL in .env";
  return { ok: false, error: hint };
};
