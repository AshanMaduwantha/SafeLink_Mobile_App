import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  topSection: {
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  middleSection: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 20,
    paddingTop: 60,
  },
  illustration: {
    width: width * 0.8,
    height: height * 0.35,
    maxWidth: 300,
    maxHeight: 250,
  },
  paginationContainer: {
    alignItems: "center",
    marginTop: -20,
    marginBottom: 100,
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
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#0B6CFF",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bottomSection: {
    alignItems: "center",
    paddingTop: 20,
  },
  nextButton: {
    backgroundColor: "#0B6CFF",
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 40,
    minWidth: width * 0.8,
    marginBottom: 16,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    borderRadius: 10,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    color: "#0B6CFF",
    fontSize: 16,
    fontWeight: "500",
  },
});
