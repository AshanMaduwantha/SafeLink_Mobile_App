import { Dimensions, Platform, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");
const TILE_SIZE = (width - 48) / 2; // 2-column grid with 16px gutters

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.select({ ios: 20, android: 20 }),
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    width: 40,
  },

  // ── Filter tabs ──────────────────────────────────────────────────────────
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F5F5F5",
  },
  filterChipActive: {
    backgroundColor: "#FF007F",
    borderColor: "#FF007F",
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666666",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },

  // ── Detect button ────────────────────────────────────────────────────────
  detectButton: {
    marginHorizontal: 20,
    marginBottom: 12,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#8A2BE2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  detectButtonDisabled: {
    backgroundColor: "#C8A8E8",
  },
  detectButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // ── Media grid ───────────────────────────────────────────────────────────
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F0F0F0",
  },
  tileImage: {
    width: "100%",
    height: "100%",
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  detectionBadge: {
    position: "absolute",
    bottom: 6,
    left: 6,
    right: 6,
    backgroundColor: "rgba(138,43,226,0.85)",
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  detectionBadgeText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
  },

  // ── Empty / Error states ─────────────────────────────────────────────────
  centeredBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999999",
    textAlign: "center",
    marginTop: 12,
  },
  errorText: {
    fontSize: 15,
    color: "#FF3B30",
    textAlign: "center",
    marginTop: 12,
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: "#FF007F",
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // ── Modal viewer ─────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalClose: {
    position: "absolute",
    top: Platform.select({ ios: 56, android: 36 }),
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: width - 32,
    height: width - 32,
    borderRadius: 12,
  },
  modalVideo: {
    width: width - 32,
    height: ((width - 32) * 9) / 16,
    borderRadius: 12,
    backgroundColor: "#000",
  },

  // ── Detection results panel ──────────────────────────────────────────────
  resultsPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: Platform.select({ ios: 34, android: 20 }),
    maxHeight: 320,
  },
  resultsPanelHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
    marginBottom: 12,
  },
  resultsPanelTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 10,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    gap: 10,
  },
  resultDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  resultLabel: {
    flex: 1,
    fontSize: 14,
    color: "#333333",
    fontWeight: "500",
  },
  resultConfidence: {
    fontSize: 13,
    color: "#666666",
  },
  noResultsText: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
    paddingVertical: 16,
  },
});
