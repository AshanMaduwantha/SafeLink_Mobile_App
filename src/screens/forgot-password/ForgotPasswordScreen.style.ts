import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#ffffffff",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
    color: "#000000",
  },
  description: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#969696",
    lineHeight: 22,
  },
  inputField: {
    minHeight: 70,
    paddingVertical: 22,
    paddingHorizontal: 24,
    fontSize: 14,
    borderRadius: 7,
  },
  input: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  formControl: {
    marginBottom: 30,
  },
  sendCodeButton: {
    backgroundColor: "#226CFF",
    borderRadius: 10,
  },
  footerText: {
    fontSize: 14,
    color: "#333",
  },
  footerSection: {
    marginTop: 380,
  },
  signInLink: {
    fontSize: 14,
    color: "#0B6CFF",
    fontWeight: "500",
  },
  titleSection: {
    marginBottom: 40,
  },
});
