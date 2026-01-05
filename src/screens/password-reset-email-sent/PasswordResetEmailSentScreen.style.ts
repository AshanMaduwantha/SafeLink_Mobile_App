import { StyleSheet } from "react-native";
import { palette } from "../../shared/theme/themes";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: palette.primary,
  },
});
