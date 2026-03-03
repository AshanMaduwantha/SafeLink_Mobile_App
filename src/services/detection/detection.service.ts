import axios from "axios";
import Config from "react-native-config";

/**
 * The HuggingFace Space base URL.
 * If DETECTION_API is explicitly set, it takes priority over ML_API_URL.
 */
const getApiBase = (): string => {
  const explicit = Config.DETECTION_API?.trim();
  if (explicit && explicit.length > 0) return explicit;
  const mlUrl = Config.ML_API_URL?.trim();
  if (mlUrl && mlUrl.length > 0) return mlUrl;
  return "https://ashan26-SafeLink.hf.space";
};

export interface BoundingBox {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
}

export interface DetectionResult {
  label: string;
  confidence: number;
  bbox?: BoundingBox;
}

export interface DetectionResponse {
  success: boolean;
  results: DetectionResult[];
  mediaKey: string;
  timestamp: Date;
  rawResponse?: any;
}

/**
 * Normalise the variety of response shapes that HuggingFace Gradio spaces
 * can return so we always work with a flat DetectionResult[].
 */
const parseResults = (responseData: any): DetectionResult[] => {
  if (!responseData) return [];

  // Gradio wraps the output in a `data` array
  const payload = Array.isArray(responseData.data)
    ? responseData.data
    : responseData;

  // Flatten nested arrays (some models return [[...]])
  const flat: any[] = Array.isArray(payload) ? payload.flat(2) : [payload];

  return flat
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      label: item.label ?? item.class ?? item.name ?? "Unknown",
      confidence:
        typeof item.score !== "undefined"
          ? item.score
          : typeof item.confidence !== "undefined"
            ? item.confidence
            : 0,
      bbox: item.box
        ? {
            xmin: item.box.xmin ?? 0,
            ymin: item.box.ymin ?? 0,
            xmax: item.box.xmax ?? 0,
            ymax: item.box.ymax ?? 0,
          }
        : undefined,
    }));
};

const DetectionService = {
  /**
   * Send an image URL to the HuggingFace detection model.
   * Tries the standard Gradio `/run/predict` endpoint first,
   * then falls back to `/api/predict`.
   */
  analyzeImage: async (
    imageUrl: string,
    mediaKey: string,
  ): Promise<DetectionResponse> => {
    const base = getApiBase();

    const endpoints = [`${base}/run/predict`, `${base}/api/predict`];

    let lastError: any;

    for (const endpoint of endpoints) {
      try {
        const response = await axios.post(
          endpoint,
          { data: [imageUrl] },
          {
            headers: { "Content-Type": "application/json" },
            timeout: 45_000,
          },
        );

        return {
          success: true,
          results: parseResults(response.data),
          mediaKey,
          timestamp: new Date(),
          rawResponse: response.data,
        };
      } catch (err: any) {
        lastError = err;
        // 404 → endpoint doesn't exist, try next
        if (err?.response?.status !== 404) break;
      }
    }

    console.error("DetectionService error:", lastError);
    throw lastError;
  },

  /**
   * Analyse a single frame of a video (pass a thumbnail / screenshot URL).
   */
  analyzeVideoFrame: async (
    frameUrl: string,
    mediaKey: string,
  ): Promise<DetectionResponse> =>
    DetectionService.analyzeImage(frameUrl, mediaKey),

  /**
   * Run detection on a batch of image URLs.
   * Returns results in the same order; failed items get an empty result set.
   */
  analyzeBatch: async (
    items: Array<{ url: string; key: string }>,
  ): Promise<DetectionResponse[]> => {
    const settled = await Promise.allSettled(
      items.map(({ url, key }) => DetectionService.analyzeImage(url, key)),
    );

    return settled.map((result, idx) =>
      result.status === "fulfilled"
        ? result.value
        : {
            success: false,
            results: [],
            mediaKey: items[idx].key,
            timestamp: new Date(),
          },
    );
  },
};

export default DetectionService;
