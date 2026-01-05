import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  headerTitle: {
    color: "#374151",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 0,
    marginLeft: 0,
  },
  header: {
    paddingTop: Platform.select({
      ios: 20,
      android: 20,
    }),
  },
  backIcon: {
    marginTop: 0,
  },
  dateHeader: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  notificationItem: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
    // subtle card shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEF3C7", // Light yellow background
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  notificationTitle: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  notificationMessage: {
    color: "#9CA3AF",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 2,
  },
  notificationMessage2: {
    color: "#9CA3AF",
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  notificationTime: {
    color: "#9CA3AF",
    fontSize: 14,
    marginLeft: 8,
  },
  markAllText: {
    color: "#2176FF",
    fontSize: 14,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginLeft: 56, // Align with notification content (40px icon + 16px margin)
  },
  spacer: {
    width: 24,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  emptyStateIconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});
