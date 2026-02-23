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

  illustrationContainer: {
    width: 260,
    height: 260,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  outerCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#FFF0ED",
    justifyContent: "center",
    alignItems: "center",
  },
  middleCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "#FCCCC6",
    justifyContent: "center",
    alignItems: "center",
  },
  innerCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E53935",
    justifyContent: "center",
    alignItems: "center",
  },
  floatingCard: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
  },
  floatTopLeft: {
    top: 25,
    left: 8,
  },
  floatTopRight: {
    top: 35,
    right: 8,
  },
  floatBottomLeft: {
    bottom: 35,
    left: 20,
  },
  floatBottomRight: {
    bottom: 40,
    right: 12,
  },

  paginationContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  paginationDots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#E53935",
  },
  bottomSection: {
    alignItems: "center",
    paddingTop: 8,
  },
  nextButton: {
    backgroundColor: "#E53935",
    borderRadius: 14,
    paddingVertical: 16,
    minWidth: width - 64,
    marginBottom: 16,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    color: "#666",
    fontSize: 15,
    fontWeight: "500",
  },
});
