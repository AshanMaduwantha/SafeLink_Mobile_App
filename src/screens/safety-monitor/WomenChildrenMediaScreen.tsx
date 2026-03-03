import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import Video from "react-native-video";
import Screen from "@/components/Screen";
import TextWrapper from "@/shared/components/text-wrapper/TextWrapper";
import fonts from "@/shared/theme/fonts";
import { DetectionService } from "@services/detection";
import type { DetectionResponse } from "@services/detection";
import { S3MediaService } from "@services/s3";
import type { MediaItem, MediaType } from "@services/s3";
import { styles } from "./styles/WomenChildrenMediaScreen.style";

type FilterType = "all" | "image" | "video";

const confidenceColor = (confidence: number): string => {
  if (confidence >= 0.8) return "#FF3B30";
  if (confidence >= 0.5) return "#FF8C00";
  return "#34C759";
};

const WomenChildrenMediaScreen = () => {
  const navigation = useNavigation<any>();

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [detecting, setDetecting] = useState(false);
  const [detectionResults, setDetectionResults] = useState<
    Record<string, DetectionResponse>
  >({});

  const videoRef = useRef<any>(null);

  // ── Load media from S3 ─────────────────────────────────────────────────
  const loadMedia = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await S3MediaService.loadMediaWithUrls();
      setMediaItems(items);
    } catch (err: any) {
      setError(
        err?.message || "Failed to load media. Please check your connection.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  // ── Filtered list ──────────────────────────────────────────────────────
  const filteredItems = mediaItems.filter((item) => {
    if (filter === "all") return item.mediaType !== "unknown";
    return item.mediaType === filter;
  });

  // ── Run detection on all visible images ───────────────────────────────
  const runDetection = async () => {
    const imagesToAnalyze = filteredItems.filter(
      (item) => item.mediaType === "image" && item.url,
    );

    if (imagesToAnalyze.length === 0) return;

    setDetecting(true);
    try {
      const responses = await DetectionService.analyzeBatch(
        imagesToAnalyze.map((item) => ({ url: item.url!, key: item.key })),
      );

      const resultsMap: Record<string, DetectionResponse> = {};
      responses.forEach((resp) => {
        resultsMap[resp.mediaKey] = resp;
      });
      setDetectionResults((prev) => ({ ...prev, ...resultsMap }));
    } catch (err) {
      console.error("Batch detection failed:", err);
    } finally {
      setDetecting(false);
    }
  };

  // ── Run detection for a single item ───────────────────────────────────
  const runSingleDetection = async (item: MediaItem) => {
    if (!item.url) return;
    setDetecting(true);
    try {
      const response = await DetectionService.analyzeImage(item.url, item.key);
      setDetectionResults((prev) => ({ ...prev, [item.key]: response }));
    } catch (err) {
      console.error("Single detection failed:", err);
    } finally {
      setDetecting(false);
    }
  };

  // ── Open viewer modal ─────────────────────────────────────────────────
  const openItem = (item: MediaItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  // ── Helpers ────────────────────────────────────────────────────────────
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ── Render helpers ─────────────────────────────────────────────────────
  const renderTile = ({ item }: { item: MediaItem }) => {
    const detection = detectionResults[item.key];
    const topResult = detection?.results?.[0];

    return (
      <TouchableOpacity
        style={styles.tile}
        onPress={() => openItem(item)}
        activeOpacity={0.85}
      >
        {item.url && item.mediaType === "image" && (
          <Image
            source={{ uri: item.url }}
            style={styles.tileImage}
            resizeMode="cover"
          />
        )}

        {item.url && item.mediaType === "video" && (
          <>
            <View style={[styles.tileImage, { backgroundColor: "#1A1A2E" }]} />
            <View style={styles.videoOverlay}>
              <Icon name="play-circle" size={40} color="rgba(255,255,255,0.9)" />
            </View>
          </>
        )}

        {!item.url && (
          <View style={[styles.tileImage, { backgroundColor: "#F0F0F0" }]}>
            <View style={styles.videoOverlay}>
              <Icon name="image-outline" size={32} color="#CCCCCC" />
            </View>
          </View>
        )}

        {topResult && (
          <View style={styles.detectionBadge}>
            <TextWrapper
              style={styles.detectionBadgeText}
              fontFamily={fonts.poppins.regular}
            >
              {topResult.label} {Math.round(topResult.confidence * 100)}%
            </TextWrapper>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderFilterChip = (label: string, value: FilterType) => (
    <TouchableOpacity
      style={[styles.filterChip, filter === value && styles.filterChipActive]}
      onPress={() => setFilter(value)}
    >
      <TextWrapper
        style={[
          styles.filterChipText,
          filter === value && styles.filterChipTextActive,
        ]}
        fontFamily={fonts.poppins.regular}
      >
        {label}
      </TextWrapper>
    </TouchableOpacity>
  );

  const renderModalContent = () => {
    if (!selectedItem) return null;
    const detection = detectionResults[selectedItem.key];

    return (
      <>
        {selectedItem.mediaType === "image" && selectedItem.url ? (
          <Image
            source={{ uri: selectedItem.url }}
            style={styles.modalImage}
            resizeMode="contain"
          />
        ) : selectedItem.mediaType === "video" && selectedItem.url ? (
          <Video
            ref={videoRef}
            source={{ uri: selectedItem.url }}
            style={styles.modalVideo}
            controls
            resizeMode="contain"
            paused={false}
          />
        ) : (
          <View style={styles.modalImage}>
            <TextWrapper style={styles.emptyText} fontFamily={fonts.poppins.regular}>
              Preview unavailable
            </TextWrapper>
          </View>
        )}

        {/* Detection results panel */}
        <View style={styles.resultsPanel}>
          <View style={styles.resultsPanelHandle} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextWrapper
              style={styles.resultsPanelTitle}
              fontFamily={fonts.poppins.regular}
            >
              Detection Results
            </TextWrapper>
            {selectedItem.mediaType === "image" && (
              <TouchableOpacity
                onPress={() => runSingleDetection(selectedItem)}
                disabled={detecting}
              >
                {detecting ? (
                  <ActivityIndicator size="small" color="#8A2BE2" />
                ) : (
                  <Icon name="scan-outline" size={22} color="#8A2BE2" />
                )}
              </TouchableOpacity>
            )}
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {!detection ? (
              <TextWrapper
                style={styles.noResultsText}
                fontFamily={fonts.poppins.regular}
              >
                Tap the scan icon to run detection on this image.
              </TextWrapper>
            ) : detection.results.length === 0 ? (
              <TextWrapper
                style={styles.noResultsText}
                fontFamily={fonts.poppins.regular}
              >
                No objects detected.
              </TextWrapper>
            ) : (
              detection.results.map((result, idx) => (
                <View key={idx} style={styles.resultItem}>
                  <View
                    style={[
                      styles.resultDot,
                      { backgroundColor: confidenceColor(result.confidence) },
                    ]}
                  />
                  <TextWrapper
                    style={styles.resultLabel}
                    fontFamily={fonts.poppins.regular}
                  >
                    {result.label}
                  </TextWrapper>
                  <TextWrapper
                    style={styles.resultConfidence}
                    fontFamily={fonts.poppins.regular}
                  >
                    {Math.round(result.confidence * 100)}%
                  </TextWrapper>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </>
    );
  };

  // ── Main render ────────────────────────────────────────────────────────
  return (
    <Screen style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <TextWrapper
          style={styles.headerTitle}
          fontFamily={fonts.poppins.regular}
        >
          Media Gallery
        </TextWrapper>
        <TouchableOpacity style={styles.backButton} onPress={loadMedia}>
          <Icon name="refresh-outline" size={22} color="#333333" />
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {renderFilterChip("All", "all")}
        {renderFilterChip("Photos", "image")}
        {renderFilterChip("Videos", "video")}
      </View>

      {/* Run Detection button */}
      <TouchableOpacity
        style={[styles.detectButton, detecting && styles.detectButtonDisabled]}
        onPress={runDetection}
        disabled={detecting || loading}
        activeOpacity={0.8}
      >
        {detecting ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Icon name="eye-outline" size={20} color="#FFFFFF" />
        )}
        <TextWrapper
          style={styles.detectButtonText}
          fontFamily={fonts.poppins.regular}
        >
          {detecting ? "Detecting…" : "Run Detection on Photos"}
        </TextWrapper>
      </TouchableOpacity>

      {/* Content */}
      {loading ? (
        <View style={styles.centeredBox}>
          <ActivityIndicator size="large" color="#FF007F" />
          <TextWrapper
            style={styles.emptyText}
            fontFamily={fonts.poppins.regular}
          >
            Loading media from S3…
          </TextWrapper>
        </View>
      ) : error ? (
        <View style={styles.centeredBox}>
          <Icon name="cloud-offline-outline" size={48} color="#FF3B30" />
          <TextWrapper
            style={styles.errorText}
            fontFamily={fonts.poppins.regular}
          >
            {error}
          </TextWrapper>
          <TouchableOpacity style={styles.retryButton} onPress={loadMedia}>
            <TextWrapper
              style={styles.retryButtonText}
              fontFamily={fonts.poppins.regular}
            >
              Retry
            </TextWrapper>
          </TouchableOpacity>
        </View>
      ) : filteredItems.length === 0 ? (
        <View style={styles.centeredBox}>
          <Icon name="images-outline" size={48} color="#CCCCCC" />
          <TextWrapper
            style={styles.emptyText}
            fontFamily={fonts.poppins.regular}
          >
            {filter === "all"
              ? "No media found in the bucket."
              : `No ${filter === "image" ? "photos" : "videos"} found.`}
          </TextWrapper>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.key}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.grid}
          renderItem={renderTile}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Full-screen viewer modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalClose} onPress={closeModal}>
            <Icon name="close" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          {renderModalContent()}
        </View>
      </Modal>
    </Screen>
  );
};

export default WomenChildrenMediaScreen;
