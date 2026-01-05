import { Platform, StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 0,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  notificationButton: {
    padding: 8,
  },
  searchInput: {
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  searchIcon: {
    marginLeft: 12,
  },
  inputField: {
    color: "#6B7280",
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  seeAll: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  card: {
    padding: 12,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  cardTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  progressBar: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    borderRadius: 9999,
    height: 6,
    marginRight: 8,
  },
  progressFill: {
    backgroundColor: "#10B981",
    height: 6,
    borderRadius: 9999,
  },
  progressText: {
    fontSize: 14,
    color: "#6B7280",
  },
  wishlistCard: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    alignItems: "center",
  },
  wishlistTextContainer: {
    flex: 1,
    justifyContent: "space-around",
    marginLeft: 16,
  },
  wishlistPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3B82F6",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});
