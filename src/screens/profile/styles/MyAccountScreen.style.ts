import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
    paddingTop: Platform.select({
      ios: 20,
      android: 20,
    }),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000000",
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: "center",
    marginTop: 16,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  cameraButton: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#226CFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  nameText: {
    marginTop: 12,
    fontWeight: "700",
    color: "#000000",
  },
  photoHelpText: {
    marginTop: 6,
    fontSize: 12,
    color: "#757575",
  },
  formContainer: {
    marginTop: 24,
    marginHorizontal: 20,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: "700",
    color: "#000000",
  },
  unsavedText: {
    color: "#F97316",
    fontSize: 12,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    marginBottom: 8,
    fontWeight: "600",
    color: "#000000",
  },
  input: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    width: "100%",
  },
  inputField: {
    minHeight: 200,
    paddingVertical: 56,
    paddingHorizontal: 48,
    fontSize: 14,
    borderRadius: 7,
    flex: 1,
  },
  selectTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 45,
    paddingHorizontal: 16,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  selectText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  selectedText: {
    color: "#000000",
  },
  iconSpacer: {
    width: 22,
  },
  saveButton: {
    marginTop: 12,
    backgroundColor: "#226CFF",
    borderRadius: 10,
  },
  placeholderText: {
    color: "#9CA3AF",
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
    shadowOffset: { width: 0, height: 2 },
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666666",
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarTextWithColor: {
    color: "#FFFFFF",
  },
  googleSyncText: {
    marginTop: 12,
    textAlign: "center",
  },
});
