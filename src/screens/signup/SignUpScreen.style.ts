import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#ffffffff",
    width: "100%",
    paddingTop: 80,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 15,
    paddingHorizontal: 20,
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
    marginBottom: 8,
    color: "#969696",
  },
  inputField: {
    minHeight: 70,
    paddingVertical: 22,
    paddingHorizontal: 24,
    fontSize: 14,
    borderRadius: 7,
    flex: 1,
  },
  selectText: {
    height: "100%",
    paddingVertical: 0,
    paddingHorizontal: 0,
    fontSize: 14,
    flex: 1,
    lineHeight: 35,
  },
  placeholderText: {
    color: "#9CA3AF",
  },
  selectedText: {
    color: "#000000",
  },
  input: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    width: "100%",
  },
  selectTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 35,
    paddingHorizontal: 16,
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
  formControl: {
    marginBottom: 5,
  },
  termsSection: {
    marginBottom: 10,
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
    color: "#0B6CFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  termsText: {
    fontSize: 14,
    color: "#333",
  },
  termsLink: {
    fontSize: 14,
    color: "#0B6CFF",
    fontWeight: "500",
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
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
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
    marginTop: 5,
  },
  footerText: {
    fontSize: 14,
    color: "#333",
  },
  footerSection: {
    marginTop: 5,
  },
  signInLink: {
    fontSize: 14,
    color: "#0B6CFF",
    fontWeight: "500",
  },
  chevronIcon: {
    marginLeft: 8,
  },
  signUpButton: {
    backgroundColor: "#226CFF",
    borderRadius: 10,
  },
  titleSection: {
    marginBottom: 5,
  },
  spinnerMargin: {
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 200,
  },
  dropdownContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    width: "85%",
    maxHeight: 280,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333333",
  },
  dropdownItemSelected: {
    color: "#0B6CFF",
    fontWeight: "500",
  },
});
