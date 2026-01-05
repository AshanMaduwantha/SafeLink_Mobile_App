import React from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
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
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {/* Account Settings */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate(SCREENS.MY_ACCOUNT as never)}
        >
          <Icon
            name="person-outline"
            size={20}
            color="#2176FF"
            style={styles.menuIcon}
          />
          <View>
            <TextWrapper
              style={styles.menuItemText}
              fontFamily={fonts.poppins.regular}
            >
              My Account
            </TextWrapper>
            <TextWrapper
              style={styles.menuItemDescription}
              fontFamily={fonts.poppins.regular}
            >
              Make changes to your account
            </TextWrapper>
          </View>
          <Icon
            name="chevron-forward-outline"
            size={20}
            color="#A0A0A0"
            style={styles.arrowIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate(SCREENS.CONTACT_US as never)}
        >
          <Icon
            name="help-circle-outline"
            size={20}
            color="#2176FF"
            style={styles.menuIcon}
          />
          <View>
            <TextWrapper
              style={styles.menuItemText}
              fontFamily={fonts.poppins.regular}
            >
              Help & Support
            </TextWrapper>
          </View>
          <Icon
            name="chevron-forward-outline"
            size={20}
            color="#A0A0A0"
            style={styles.arrowIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate(SCREENS.ABOUT as never)}
        >
          <Icon
            name="information-circle-outline"
            size={20}
            color="#2176FF"
            style={styles.menuIcon}
          />
          <View>
            <TextWrapper
              style={styles.menuItemText}
              fontFamily={fonts.poppins.regular}
            >
              About App
            </TextWrapper>
          </View>
          <Icon
            name="chevron-forward-outline"
            size={20}
            color="#A0A0A0"
            style={styles.arrowIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Icon
            name="log-out-outline"
            size={20}
            color="#2176FF"
            style={styles.menuIcon}
          />
          <View>
            <TextWrapper
              style={styles.menuItemText}
              fontFamily={fonts.poppins.regular}
            >
              Log out
            </TextWrapper>
            <TextWrapper
              style={styles.menuItemDescription}
              fontFamily={fonts.poppins.regular}
            >
              Sign out of your account
            </TextWrapper>
          </View>
          <Icon
            name="chevron-forward-outline"
            size={20}
            color="#A0A0A0"
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default OverviewTab;
