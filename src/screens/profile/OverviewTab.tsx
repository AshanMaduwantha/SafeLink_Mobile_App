import React from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { notificationStorage } from "@/services/notifications/notificationStorage";
import { getAuth, signOut } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { notificationService } from "@services/notifications/notifications";
import { SCREENS } from "@shared-constants";
import TextWrapper from "../../shared/components/text-wrapper/TextWrapper";
import fonts from "../../shared/theme/fonts";
import { styles } from "./styles/ProfileScreen.style";

const OverviewTab = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const sectionOneItems = [
    {
      key: "my_account",
      title: "My Account",
      description: "Manage your account details",
      icon: "person-outline",
      iconColor: "#EF4444",
      iconBackgroundColor: "#FEE2E2",
      onPress: () => navigation.navigate(SCREENS.MY_ACCOUNT as never),
    },
    {
      key: "privacy",
      title: "Privacy & Security",
      description: "Control your privacy settings",
      icon: "lock-closed-outline",
      iconColor: "#2563EB",
      iconBackgroundColor: "#DBEAFE",
      onPress: () => Alert.alert("Coming soon", "Privacy settings coming soon."),
    },
    {
      key: "notifications",
      title: "Notifications",
      description: "Manage notification preferences",
      icon: "notifications-outline",
      iconColor: "#9333EA",
      iconBackgroundColor: "#F3E8FF",
      onPress: () => navigation.navigate(SCREENS.NOTIFICATION as never),
    },
    {
      key: "emergency",
      title: "Emergency Contacts",
      description: "Add and manage contacts",
      icon: "call-outline",
      iconColor: "#EA580C",
      iconBackgroundColor: "#FFEDD5",
      onPress: () =>
        Alert.alert("Coming soon", "Emergency contacts module coming soon."),
    },
  ];

  const sectionTwoItems = [
    {
      key: "help_support",
      title: "Help & Support",
      description: "Get help with your account",
      icon: "help-circle-outline",
      iconColor: "#16A34A",
      iconBackgroundColor: "#DCFCE7",
      onPress: () => navigation.navigate(SCREENS.CONTACT_US as never),
    },
    {
      key: "about",
      title: "About SafeGuard",
      description: "Learn more about the app",
      icon: "information-circle-outline",
      iconColor: "#4F46E5",
      iconBackgroundColor: "#E0E7FF",
      onPress: () => navigation.navigate(SCREENS.ABOUT as never),
    },
    {
      key: "app_settings",
      title: "App Settings",
      description: "Configure app preferences",
      icon: "settings-outline",
      iconColor: "#6B7280",
      iconBackgroundColor: "#E5E7EB",
      onPress: () => Alert.alert("Coming soon", "App settings coming soon."),
    },
  ];

  const renderMenuRow = (
    item: {
      key: string;
      title: string;
      description: string;
      icon: string;
      iconColor: string;
      iconBackgroundColor: string;
      onPress: () => void;
    },
    isLast: boolean,
  ) => (
    <TouchableOpacity
      key={item.key}
      style={[styles.menuItem, isLast && styles.menuItemLast]}
      onPress={item.onPress}
      activeOpacity={0.75}
    >
      <View
        style={[
          styles.menuIconCircle,
          {
            backgroundColor: item.iconBackgroundColor,
          },
        ]}
      >
        <Icon name={item.icon} size={19} color={item.iconColor} />
      </View>

      <View style={styles.menuTextContent}>
        <TextWrapper style={styles.menuItemTitle} fontFamily={fonts.poppins.regular}>
          {item.title}
        </TextWrapper>
        <TextWrapper
          style={styles.menuItemSubtitle}
          fontFamily={fonts.poppins.regular}
        >
          {item.description}
        </TextWrapper>
      </View>

      <View style={styles.chevronCircle}>
        <Icon
          name="chevron-forward-outline"
          size={18}
          color="#9CA3AF"
          style={styles.arrowIcon}
        />
      </View>
    </TouchableOpacity>
  );

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try {
            const { currentUser } = auth;
            const providerIds =
              currentUser?.providerData?.map(
                (provider) => provider.providerId,
              ) ?? [];
            const isGoogleUser = providerIds.includes("google.com");

            // Remove FCM token
            await notificationService.removeFCMToken();

            //Clear notification storage
            await notificationStorage.clearNotifications();

            // Sign out of Google if needed to avoid cached state
            if (isGoogleUser) {
              try {
                await GoogleSignin.signOut();
              } catch (googleError) {
                console.warn("Google sign out skipped:", googleError);
              }
            }

            // Finally sign out from Firebase
            await signOut(auth);
            console.log("Data cleared & user signed out!");

            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: SCREENS.LOGIN as never }],
              }),
            );
          } catch (error) {
            Alert.alert("Error", "Failed to log out. Please try again.");
            console.error(error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.profileSectionsContainer}>
      <TextWrapper style={styles.sectionTitle} fontFamily={fonts.poppins.regular}>
        ACCOUNT SETTINGS
      </TextWrapper>
      <View style={styles.sectionCard}>
        {sectionOneItems.map((item, index) =>
          renderMenuRow(item, index === sectionOneItems.length - 1),
        )}
      </View>

      <TextWrapper
        style={[styles.sectionTitle, styles.secondarySectionTitle]}
        fontFamily={fonts.poppins.regular}
      >
        SUPPORT & INFORMATION
      </TextWrapper>
      <View style={styles.sectionCard}>
        {sectionTwoItems.map((item, index) =>
          renderMenuRow(item, index === sectionTwoItems.length - 1),
        )}
      </View>

      <TouchableOpacity
        style={[styles.sectionCard, styles.logoutCard]}
        onPress={handleLogout}
        activeOpacity={0.75}
      >
        <View style={[styles.menuItem, styles.menuItemLast, styles.logoutRow]}>
          <View style={[styles.menuIconCircle, styles.logoutIconCircle]}>
            <Icon name="log-out-outline" size={19} color="#EF4444" />
          </View>

          <View style={styles.menuTextContent}>
            <TextWrapper style={styles.logoutTitle} fontFamily={fonts.poppins.regular}>
              Log Out
            </TextWrapper>
            <TextWrapper
              style={styles.logoutSubtitle}
              fontFamily={fonts.poppins.regular}
            >
              Sign out of your account
            </TextWrapper>
          </View>

          <View style={[styles.chevronCircle, styles.logoutChevronCircle]}>
            <Icon
              name="chevron-forward-outline"
              size={18}
              color="#EF4444"
              style={styles.arrowIcon}
            />
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.appVersionContainer}>
        <TextWrapper style={styles.appVersionText} fontFamily={fonts.poppins.regular}>
          SafeGuard Emergency App
        </TextWrapper>
        <TextWrapper style={styles.appVersionText} fontFamily={fonts.poppins.regular}>
          Version 2.4.1
        </TextWrapper>
      </View>
    </View>
  );
};

export default OverviewTab;
