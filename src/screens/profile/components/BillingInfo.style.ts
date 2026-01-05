import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  billingDateContainer: {
    marginBottom: 20,
  },
  billingLabel: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 4,
    fontWeight: "400",
  },
  billingDate: {
    fontSize: 12,
    color: "#000000",
    fontWeight: "800",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#2176FF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#d40e0eff",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#d40e0eff",
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancellationMessageContainer: {
    marginTop: 8,
  },
  cancellationMessage: {
    fontSize: 12,
    color: "#EF4444",
  },
});
