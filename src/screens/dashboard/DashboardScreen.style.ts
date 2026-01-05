import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.select({
      ios: 20,
      android: 20,
    }),
    paddingBottom: 5,
  },
  classestop: {
    marginTop: 30,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  userName: {
    fontSize: 14,
    color: "#6B7280",
  },
  searchBar: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  searchPlaceholder: {
    color: "#9CA3AF",
    flex: 1,
  },
  searchIcon: {
    marginLeft: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2563EB",
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryButtonActive: {
    backgroundColor: "#2563EB",
  },
  categoryButtonInactive: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryText: {
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#ffffff",
  },
  categoryTextInactive: {
    color: "#374151",
  },
  courseCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    overflow: "hidden",
    width: 280,
    marginRight: 16,
  },
  courseImage: {
    width: "100%",
    height: 160,
  },
  courseContent: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  instructorInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  instructorImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  instructorName: {
    fontSize: 14,
    color: "#6B7280",
  },
  courseFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  coursePrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563EB",
  },
  courseRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingIcon: {
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#6B7280",
  },
  newsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    overflow: "hidden",
    width: 280,
    marginRight: 16,
  },
  newsImage: {
    width: "100%",
    height: 128,
  },
  newsContent: {
    padding: 16,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  newsDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  categoryScrollContainer: {
    paddingRight: 16,
  },
  courseCardWidth: {
    width: 220,
  },
  newsCardWidth: {
    width: 220,
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
  },
});
