import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "@react-native-firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { Text } from "@/components/ui/text";
import { SCREENS } from "@shared-constants";
import { styles } from "./DashboardScreen.style";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const SERVICE_CARDS = [
  {
    key: "sos",
    title: "Emergency SOS",
    subtitle: "Immediate assistance",
    icon: "alert-circle-outline",
    color: "#E53935",
  },
  {
    key: "women",
    title: "Women & Children",
    subtitle: "Protection services",
    icon: "people-outline",
    color: "#EC407A",
  },
  {
    key: "traffic",
    title: "Traffic Violation",
    subtitle: "Report incidents",
    icon: "warning-outline",
    color: "#F57C00",
  },
];

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const { currentUser } = getAuth();
  const displayName = currentUser?.displayName || "User";
  const photoURL = currentUser?.photoURL;

  const handleStartLive = async () => {
    setLoading(true);
    try {
      const meetingId = "live_stream_channel";
      navigation.navigate(SCREENS.LIVE_STREAM, { meetingId });
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message ||
          "Failed to start live stream. Please check your connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCardPress = (key: string) => {
    switch (key) {
      case "sos":
        return handleStartLive();
      case "women":
        return navigation.navigate(SCREENS.SAFETY_MONITOR_WOMEN_CHILDREN);
      case "traffic":
        return navigation.navigate(SCREENS.SAFETY_MONITOR);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
            <Text style={styles.userName}>{displayName}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.notificationBtn}
          onPress={() => navigation.navigate(SCREENS.NOTIFICATION)}
          activeOpacity={0.7}
        >
          <Icon name="notifications-outline" size={22} color="#1a1a1a" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        {SERVICE_CARDS.map((card) => (
          <TouchableOpacity
            key={card.key}
            style={[styles.serviceCard, { backgroundColor: card.color }]}
            onPress={() => handleCardPress(card.key)}
            activeOpacity={0.85}
            disabled={card.key === "sos" && loading}
          >
            <View style={styles.cardIconContainer}>
              {card.key === "sos" && loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Icon name={card.icon} size={28} color="white" />
              )}
            </View>
            <View>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default DashboardScreen;
