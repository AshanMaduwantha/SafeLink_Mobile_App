import React, { useCallback, useMemo, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import Screen from "@/components/Screen";
import { getUserProfile, UserProfile } from "@/services/user";
import { getAvatarProps } from "@/utils/avatar";
import { getAuth, reload } from "@react-native-firebase/auth";
import TextWrapper from "../../shared/components/text-wrapper/TextWrapper";
import fonts from "../../shared/theme/fonts";
import OverviewTab from "./OverviewTab";
import { styles } from "./styles/ProfileScreen.style";

const ProfileScreen = () => {
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const displayName = userProfile?.name?.trim() || user?.displayName || "User";
  const photoURL = userProfile?.photoURL || user?.photoURL || undefined;
  const userAvatar = useMemo(
    () => getAvatarProps(displayName, photoURL, "lg"),
    [displayName, photoURL],
  );
  const profileHandle = useMemo(() => {
    const emailHandle = user?.email?.split("@")[0]?.trim();
    if (emailHandle) {
      return `@${emailHandle.replace(/\s+/g, "").toLowerCase()}`;
    }

    const nameHandle = displayName.replace(/\s+/g, "").toLowerCase();
    return `@${nameHandle || "safeguard_user"}`;
  }, [displayName, user?.email]);

  const memberSince = useMemo(() => {
    const createdAt = user?.metadata?.creationTime;
    if (!createdAt) {
      return "Safety member";
    }

    const parsedDate = new Date(createdAt);
    if (Number.isNaN(parsedDate.getTime())) {
      return "Safety member";
    }

    return `Member since ${parsedDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })}`;
  }, [user?.metadata?.creationTime]);

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
          <View style={styles.flexFill} />
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
            <View style={styles.profileTitleRow}>
              <TextWrapper
                style={styles.profileName}
                fontFamily={fonts.poppins.regular}
                numberOfLines={1}
              >
                {displayName}
              </TextWrapper>
              <View style={styles.verifiedBadge}>
                <Icon name="checkmark-circle" size={14} color="#DFF5E7" />
                <TextWrapper
                  style={styles.verifiedBadgeText}
                  fontFamily={fonts.poppins.regular}
                >
                  Verified
                </TextWrapper>
              </View>
            </View>
            <TextWrapper style={styles.profileHandle} fontFamily={fonts.poppins.regular}>
              {profileHandle}
            </TextWrapper>
            <TextWrapper
              style={styles.profileMetaText}
              fontFamily={fonts.poppins.regular}
            >
              {memberSince}
            </TextWrapper>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.tabContent}>
          <OverviewTab />
        </View>
      </ScrollView>
    </Screen>
  );
};

export default ProfileScreen;
