import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import MapView, { Heatmap, Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import Screen from "@/components/Screen";
import TextWrapper from "@/shared/components/text-wrapper/TextWrapper";
import fonts from "@/shared/theme/fonts";
import {
  HeatmapAudience,
  HeatmapPoint,
  loadHeatmapPoints,
} from "@/services/safety/heatmap.service";
import { styles } from "./styles/ViewHeatmapScreen.style";

const DEFAULT_REGION: Region = {
  latitude: 7.8731,
  longitude: 80.7718,
  latitudeDelta: 3.5,
  longitudeDelta: 3.5,
};

const ViewHeatmapScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedFilter, setSelectedFilter] = useState<HeatmapAudience>("women");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [points, setPoints] = useState<HeatmapPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 450);
    return () => clearTimeout(id);
  }, [searchQuery]);

  // Fetch heatmap data whenever filter or search changes
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      const result = await loadHeatmapPoints(selectedFilter, debouncedSearch || undefined);

      if (cancelled) return;

      if (result.ok) {
        setPoints(result.points);
      } else {
        setError(result.error);
        setPoints([]);
      }
      setIsLoading(false);
    };

    load();
    return () => { cancelled = true; };
  }, [selectedFilter, debouncedSearch]);

  const mapRegion = useMemo<Region>(() => {
    if (points.length === 0) return DEFAULT_REGION;

    const lats = points.map((p) => p.latitude);
    const lngs = points.map((p) => p.longitude);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max((maxLat - minLat) * 1.5, 0.1),
      longitudeDelta: Math.max((maxLng - minLng) * 1.5, 0.1),
    };
  }, [points]);

  const canRenderHeatLayer = Platform.OS === "android";

  return (
    <Screen style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <TextWrapper style={styles.headerTitle} fontFamily={fonts.poppins.regular}>
          View Heatmap
        </TextWrapper>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#A0A0A0" style={styles.searchIcon} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholder="Search location..."
            placeholderTextColor="#A0A0A0"
          />
        </View>

        {/* Women / Children toggle */}
        <View style={styles.filterContainer}>
          {(["women", "children"] as HeatmapAudience[]).map((filter) => {
            const isActive = selectedFilter === filter;
            const activeStyle =
              filter === "women" ? styles.filterButtonWomenActive : styles.filterButtonChildrenActive;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterButton, isActive && activeStyle]}
                onPress={() => setSelectedFilter(filter)}
                activeOpacity={0.8}
              >
                <TextWrapper
                  style={[styles.filterButtonText, isActive && styles.filterButtonTextActive]}
                  fontFamily={fonts.poppins.regular}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </TextWrapper>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={DEFAULT_REGION}
            region={mapRegion}
            provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
            showsUserLocation
            showsCompass
          >
            {canRenderHeatLayer && points.length > 0 && (
              <Heatmap
                points={points}
                radius={45}
                opacity={0.75}
                gradient={{
                  colors: ["#22C55E", "#FACC15", "#FB923C", "#EF4444"],
                  startPoints: [0.2, 0.45, 0.7, 1.0],
                  colorMapSize: 256,
                }}
              />
            )}
            {points.map((point, index) => (
              <Marker
                key={`${point.latitude}-${point.longitude}-${index}`}
                coordinate={{ latitude: point.latitude, longitude: point.longitude }}
                pinColor="#1D4ED8"
              />
            ))}
          </MapView>

          {/* Loading overlay */}
          {isLoading && (
            <View style={styles.overlayState}>
              <ActivityIndicator size="small" color="#2563EB" />
              <TextWrapper style={styles.overlayText} fontFamily={fonts.poppins.regular}>
                Loading heatmap...
              </TextWrapper>
            </View>
          )}

          {/* Error overlay */}
          {!isLoading && !!error && (
            <View style={styles.overlayState}>
              <Icon name="warning-outline" size={28} color="#DC2626" />
              <TextWrapper style={styles.errorText} fontFamily={fonts.poppins.regular}>
                {error}
              </TextWrapper>
            </View>
          )}

          {/* Empty state */}
          {!isLoading && !error && points.length === 0 && (
            <View style={styles.overlayState}>
              <Icon name="map-outline" size={28} color="#9CA3AF" />
              <TextWrapper style={styles.overlayText} fontFamily={fonts.poppins.regular}>
                No incidents found for {selectedFilter}.
              </TextWrapper>
            </View>
          )}
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          <TextWrapper style={styles.legendTitle} fontFamily={fonts.poppins.regular}>
            Risk Levels
          </TextWrapper>
          <View style={styles.legendItems}>
            {[
              { label: "Low", style: styles.legendGreen },
              { label: "Medium", style: styles.legendYellow },
              { label: "High", style: styles.legendOrange },
              { label: "Critical", style: styles.legendRed },
            ].map(({ label, style }) => (
              <View key={label} style={styles.legendItem}>
                <View style={[styles.legendCircle, style]} />
                <TextWrapper style={styles.legendText} fontFamily={fonts.poppins.regular}>
                  {label}
                </TextWrapper>
              </View>
            ))}
          </View>
        </View>

        {/* Point count badge */}
        {!isLoading && points.length > 0 && (
          <TextWrapper style={styles.footerInstruction} fontFamily={fonts.poppins.regular}>
            {points.length} incident location{points.length !== 1 ? "s" : ""} plotted ·{" "}
            {selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}
          </TextWrapper>
        )}
      </ScrollView>
    </Screen>
  );
};

export default ViewHeatmapScreen;
