import { Platform, StyleSheet } from "react-native";

export const ScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  view: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingTop: Platform.select({
      ios: 20,
      android: 0,
    }),
  },
});
