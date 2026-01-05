import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  titleSection: {
    marginBottom: 20,
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
  formControl: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  inputField: {
    paddingHorizontal: 10,
    height: 40,
  },
  resetButton: {
    marginTop: 20,
  },
  footerSection: {
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
  },
  signInLink: {
    fontSize: 14,
    color: "blue", // Or your theme's primary color
    fontWeight: "bold",
  },
});
