import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  verifyingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 20,
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
    marginTop: 10,
    textAlign: "center",
  },
});
