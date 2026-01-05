import { Platform, StyleSheet } from "react-native";
import { COLORS } from "../../../shared/constants";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingBottom: 20,
  },
  mainContentContainer: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    padding: 10,
    paddingTop: Platform.select({
      ios: 20,
      android: 20,
    }),
  },
  headerTitleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000000",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.TEXT_DARK,
  },
  input: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    padding: 12,
    fontSize: 16,
    color: COLORS.TEXT_DARK,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    width: "100%",
  },
  messageInput: {
    height: 120,
    textAlignVertical: "top",
  },
  selectText: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    fontSize: 14,
    flex: 1,
  },
  placeholderText: {
    color: COLORS.GREY_LIGHT,
  },
  selectedText: {
    color: COLORS.BLACK,
  },
  selectTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    minHeight: 48,
  },
  chevronIcon: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 200,
  },
  dropdownContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    width: "85%",
    maxHeight: 280,
    shadowColor: COLORS.BLACK,
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
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    fontSize: 16,
    color: COLORS.TEXT_DARK,
  },
  dropdownItemSelected: {
    color: COLORS.PRIMARY,
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  submitButtonText: {
    color: COLORS.WHITE,
    fontSize: 18,
  },
});
