import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  topSection: {
    alignItems: "center",
    paddingTop: 20,
  },
  badgeIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#E53935",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 14,
  },
  description: {
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    lineHeight: 23,
    paddingHorizontal: 10,
  },

  middleSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 180,
    marginBottom: 28,
  },
  featureCard: {
    width: 90,
    height: 120,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  featureCardCenter: {
    width: 110,
    height: 145,
    borderRadius: 20,
    zIndex: 2,
    marginHorizontal: -8,
  },
  featureCardLeft: {
    transform: [{ rotate: "-8deg" }],
    marginTop: 10,
    zIndex: 1,
  },
  featureCardRight: {
    transform: [{ rotate: "8deg" }],
    marginTop: 10,
    zIndex: 1,
  },
  featureCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  featureCardTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    lineHeight: 16,
  },

  smallIconsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 28,
  },
  smallIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  bottomSection: {
    alignItems: "center",
    paddingTop: 20,
  },
  getStartedButton: {
    backgroundColor: "#E53935",
    borderRadius: 14,
    paddingVertical: 16,
    minWidth: width - 64,
    marginBottom: 16,
  },
  getStartedButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
