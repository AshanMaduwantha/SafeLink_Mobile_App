import React, { useCallback, useMemo, useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import Screen from "@/components/Screen";
import { getUserProfile, UserProfile } from "@/services/user";
import { getAvatarProps } from "@/utils/avatar";
import { getAuth, reload } from "@react-native-firebase/auth";
import { SCREENS } from "@shared-constants";
import TextWrapper from "../../shared/components/text-wrapper/TextWrapper";
import fonts from "../../shared/theme/fonts";
import OverviewTab from "./OverviewTab";
import { styles } from "./styles/ProfileScreen.style";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const displayName = userProfile?.name?.trim() || user?.displayName || "User";
  const photoURL = userProfile?.photoURL || user?.photoURL || undefined;
  const userAvatar = useMemo(
    () => getAvatarProps(displayName, photoURL, "lg"),
    [displayName, photoURL],
  );
  const [activeTab, setActiveTab] = useState("Overview");

  const loadUserProfile = useCallback(async (uid: string) => {
    try {
      const profile = await getUserProfile(uid);
      setUserProfile(profile);
    } catch (error) {
      console.error("Failed to load user profile:", error);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;

      const refreshUser = async () => {
        const { currentUser } = auth;

        if (!currentUser) {
          if (isMounted) {
            setUser(null);
            setUserProfile(null);
          }
          return;
        }

        try {
          await reload(currentUser);
        } catch (reloadError) {
          console.warn("Failed to reload user:", reloadError);
        }

        if (!isMounted) {
          return;
        }

        setUser(auth.currentUser);

        if (auth.currentUser) {
          await loadUserProfile(auth.currentUser.uid);
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      refreshUser();

      return () => {
        isMounted = false;
      };
    }, [auth, loadUserProfile]),
  );

  const handleNotificationPress = () => {
    navigation.navigate(SCREENS.NOTIFICATION as never);
  };

  return (
    <Screen style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.flexFill} />
          <TextWrapper
            style={styles.headerTitle}
            fontFamily={fonts.poppins.regular}
          >
            Profile
          </TextWrapper>
          <View style={styles.rightAligned}>
            <TouchableOpacity onPress={handleNotificationPress}>
              <Icon name="notifications-outline" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          {userAvatar.hasPhoto ? (
            <Image
              source={{ uri: userAvatar.photoURL! }}
              style={styles.profileImage}
            />
          ) : (
            <View
              style={[
                styles.profileImage,
                styles.avatarContainer,
                {
                  backgroundColor: userAvatar.color,
                },
              ]}
            >
              <TextWrapper
                style={[styles.avatarText, { fontSize: userAvatar.fontSize }]}
                fontFamily={fonts.poppins.regular}
              >
                {userAvatar.initial}
              </TextWrapper>
            </View>
          )}
          <View style={styles.profileInfo}>
            <TextWrapper
              style={styles.profileName}
              fontFamily={fonts.poppins.regular}
            >
              {displayName}
            </TextWrapper>
            <TextWrapper
              style={styles.profileHandle}
              fontFamily={fonts.poppins.regular}
            >
              @StudioMate
            </TextWrapper>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "Overview" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("Overview")}
          >
            <TextWrapper
              style={[
                styles.tabButtonText,
                activeTab === "Overview" && styles.activeTabButtonText,
              ]}
              fontFamily={fonts.poppins.regular}
            >
              Overview
            </TextWrapper>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "Membership" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("Membership")}
          >
            <TextWrapper
              style={[
                styles.tabButtonText,
                activeTab === "Membership" && styles.activeTabButtonText,
              ]}
              fontFamily={fonts.poppins.regular}
            >
              Membership
            </TextWrapper>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          <OverviewTab />
        </View>
      </ScrollView>
    </Screen>
  );
};

export default ProfileScreen;
