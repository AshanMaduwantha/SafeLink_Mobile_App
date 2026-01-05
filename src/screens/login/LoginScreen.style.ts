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
  subtitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#969696",
  },
  forgotPassword: {
    marginTop: 15,
    color: "#0B6CFF",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#0B6CFF",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  checkmark: {
    color: "#6200ee",
    fontSize: 12,
    fontWeight: "bold",
  },
  rememberText: {
    fontSize: 14,
    color: "#333",
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#a7a7a7ff",
  },
  dividerText: {
    fontSize: 14,
    color: "#666",
    paddingHorizontal: 16,
  },
  socialButton: {
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    minHeight: 50,
  },
  socialButtonText: {
    fontSize: 16,
    color: "#4B5563",
    fontWeight: "500",
  },
  facebookLogo: {
    fontSize: 28,
    color: "#1877f2",
    fontWeight: "bold",
    fontFamily: "Arial",
  },
  socialSection: {
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#333",
  },
  footerSection: {
    marginTop: 60,
  },
  signUpLink: {
    fontSize: 14,
    color: "#0B6CFF",
    fontWeight: "500",
  },
  signUpButton: {
    backgroundColor: "#226CFF",
    borderRadius: 10,
  },
  titleSection: {
    marginBottom: 20,
  },
  inputField: {
    minHeight: 70,
    paddingVertical: 22,
    paddingHorizontal: 24,
    fontSize: 14,
    borderRadius: 16,
  },
  input: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  passwordPlaceholder: {
    fontSize: 20,
    letterSpacing: 2,
  },
  passwordInputContainer: {
    position: "relative",
    justifyContent: "center",
  },
  passwordToggle: {
    position: "absolute",
    right: 15,
    padding: 8,
    zIndex: 1,
  },
  forgotPasswordLink: {
    alignSelf: "flex-end",
    marginTop: 10,
  },
  forgotPasswordText: {
    color: "#0B6CFF",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  formControl: {
    marginBottom: 12,
  },
  rememberMeSection: {
    marginBottom: 25,
  },
  spinnerMargin: {
    marginRight: 8,
  },
});
