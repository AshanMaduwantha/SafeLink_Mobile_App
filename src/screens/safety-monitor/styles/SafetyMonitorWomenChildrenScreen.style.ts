import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.select({
      ios: 20,
      android: 20,
    }),
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  safetyLevelCard: {
    backgroundColor: "#FFF8DD",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#FFC300",
  },
  safetyLevelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  safetyLevelTitle: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "600",
  },
  shieldIconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginBottom: 20,
    gap: 8,
  },
  bar: {
    width: 20,
    backgroundColor: "#FFC300",
    borderRadius: 2,
  },
  barShort: {
    height: 30,
  },
  barMedium: {
    height: 50,
  },
  barTall: {
    height: 70,
  },
  safetyStatus: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFC300",
    textAlign: "center",
    marginBottom: 8,
  },
  safetyDescription: {
    fontSize: 14,
    color: "#A0A0A0",
    textAlign: "center",
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  actionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  heatmapButton: {
    backgroundColor: "#FF007F",
  },
  alertsButton: {
    backgroundColor: "#8A2BE2",
  },
  insightsButton: {
    backgroundColor: "#6A5ACD",
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
