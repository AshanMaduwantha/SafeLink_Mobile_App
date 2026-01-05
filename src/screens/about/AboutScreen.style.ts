import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.select({
      ios: 20,
      android: 20,
    }),
    paddingBottom: 8,
  },
  backIcon: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000000",
  },
  spacer: {
    width: 24,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  logo: {
    width: 180,
    height: 60,
  },
  appTitle: {
    fontSize: 22,
    color: "#111827",
    textAlign: "center",
  },
  appSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 8,
  },
  cardTitle: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  rowLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  rowValue: {
    fontSize: 13,
    color: "#111827",
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },
  sectionText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
});

export { styles };
