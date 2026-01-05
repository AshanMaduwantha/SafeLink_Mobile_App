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
    color: "#000000",
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
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  illustration: {
    width: width * 0.8,
    height: height * 0.35,
    maxWidth: 300,
    maxHeight: 250,
  },
  bottomSection: {
    alignItems: "center",
    paddingTop: 20,
  },
  getStartedButton: {
    backgroundColor: "#0B6CFF",
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 40,
    minWidth: width * 0.8,
    marginBottom: 20,
  },
  getStartedButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  legalText: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  linkText: {
    color: "#0B6CFF",
    textDecorationLine: "underline",
  },
});
