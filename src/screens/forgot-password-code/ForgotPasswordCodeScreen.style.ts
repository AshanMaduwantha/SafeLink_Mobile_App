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
    lineHeight: 22,
  },
  titleSection: {
    marginBottom: 40,
  },
  codeInputSection: {
    marginBottom: 40,
  },
  codeInput: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#ffffff",
  },
  codeInputEmpty: {
    borderColor: "#E0E0E0",
    color: "#000000",
  },
  codeInputFilled: {
    borderColor: "#226CFF",
    color: "#000000",
  },
  verifyButton: {
    borderRadius: 10,
    marginBottom: 20,
  },
  verifyButtonActive: {
    backgroundColor: "#226CFF",
  },
  verifyButtonInactive: {
    backgroundColor: "#CCCCCC",
  },
  resendSection: {
    alignItems: "center",
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendText: {
    fontSize: 14,
    textAlign: "center",
  },
  resendTextActive: {
    color: "#226CFF",
    fontWeight: "500",
  },
  resendTextInactive: {
    color: "#969696",
    fontWeight: "400",
  },
});
