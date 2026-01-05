import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  bottomNavContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  bottomNavItem: {
    alignItems: "center",
  },
  bottomNavText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  bottomNavTextActive: {
    fontSize: 12,
    color: "#007AFF",
    marginTop: 4,
  },
});
