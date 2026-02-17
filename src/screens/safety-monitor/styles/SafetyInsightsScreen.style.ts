import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
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
  insightCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightHeader: {
    flexDirection: "row",
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  insightContent: {
    flex: 1,
    gap: 4,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  insightValue: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  insightTimeframe: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  insightDescription: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  insightDetails: {
    fontSize: 12,
    color: "#A0A0A0",
    marginTop: 4,
  },
  insightAdvice: {
    fontSize: 12,
    color: "#A0A0A0",
    marginTop: 8,
    lineHeight: 18,
  },
});
