import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: Platform.select({
      ios: 20,
      android: 20,
    }),
  },
  headerContainer: {
    backgroundColor: "#F8F8F8",
    paddingBottom: 16,
    width: "100%",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 0,
  },
  notificationIconPlaceholder: {
    width: 24,
    height: 24,
    backgroundColor: "#E0E0E0",
    borderRadius: 12,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2176FF",
    marginHorizontal: 20,
    marginTop: 16,
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  profileHandle: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuItemText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  menuItemText2: {
    fontSize: 14,
    color: "#000",
    fontWeight: "medium",
    marginTop: 20,
  },
  cardtext: {
    color: "#fff",
  },
  menuItemTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  menuItemDescription: {
    fontSize: 12,
    color: "#A0A0A0",
    marginLeft: 5,
  },
  menuIcon: {
    marginRight: 15,
    backgroundColor: "#E8F2FF",
    padding: 8,
    borderRadius: 20,
    overflow: "hidden",
  },
  arrowIcon: {
    marginLeft: "auto",
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    marginLeft: "auto",
  },
  moreTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 30,
    marginHorizontal: 20,
  },
  flexFill: {
    flex: 1,
  },
  rightAligned: {
    flex: 1,
    alignItems: "flex-end",
    marginTop: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 96,
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginHorizontal: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    marginRight: 20,
  },
  activeTabButton: {
    borderBottomColor: "#2176FF",
  },
  tabButtonText: {
    fontSize: 16,
    color: "#A0A0A0", // Lighter for inactive
    fontWeight: "bold",
  },
  activeTabButtonText: {
    color: "#333333", // Darker for active
  },
  tabContent: {
    flex: 1,
    marginTop: 10,
  },
  membershipCard: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 20,
    height: 200,
    backgroundColor: "#ffffff",
  },
  marginTop20: {
    marginTop: 20,
  },
});
