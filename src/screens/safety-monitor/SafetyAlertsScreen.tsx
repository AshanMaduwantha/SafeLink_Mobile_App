import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import Screen from "@/components/Screen";
import TextWrapper from "@/shared/components/text-wrapper/TextWrapper";
import fonts from "@/shared/theme/fonts";
import { styles } from "./styles/SafetyAlertsScreen.style";

const SafetyAlertsScreen = () => {
  const navigation = useNavigation<any>();

  const alerts = [
    {
      id: 1,
      title: "Recent Incident Reported",
      description: "Suspicious activity reported in the area",
      location: "Downtown Plaza, Market Street",
      time: "Active now",
      severity: "High",
      severityColor: "#FF0000",
      severityTextColor: "#FFFFFF",
      borderColor: "#FFB6C1",
      backgroundColor: "#FFF0F5",
      icon: "warning",
      iconColor: "#FF0000",
    },
    {
      id: 2,
      title: "High Crowd Density",
      description: "Large gathering expected during evening hours",
      location: "Central Park, North Entrance",
      time: "Next 2 hours",
      severity: "Medium",
      severityColor: "#FFD700",
      severityTextColor: "#000000",
      borderColor: "#FFE4B5",
      backgroundColor: "#FFFACD",
      icon: "people",
      iconColor: "#FF8C00",
    },
    {
      id: 3,
      title: "Poor Street Lighting",
      description: "Limited visibility in this area after dark",
      location: "Oak Street between 5th & 6th Ave",
      time: "6:00 PM - 6:00 AM",
      severity: "Medium",
      severityColor: "#FFD700",
      severityTextColor: "#000000",
      borderColor: "#FFE4B5",
      backgroundColor: "#FFFACD",
      icon: "bulb",
      iconColor: "#FF8C00",
    },
    {
      id: 4,
      title: "Heavy Traffic Area",
      description: "Increased pedestrian and vehicle activity",
      location: "Main Boulevard & 1st Avenue",
      time: "5:00 PM - 7:00 PM",
      severity: "Low",
      severityColor: "#4169E1",
      severityTextColor: "#FFFFFF",
      borderColor: "#B0E0E6",
      backgroundColor: "#E0F6FF",
      icon: "car",
      iconColor: "#4169E1",
    },
  ];

  return (
    <Screen style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <TextWrapper
          style={styles.headerTitle}
          fontFamily={fonts.poppins.regular}
        >
          Safety Alerts
        </TextWrapper>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {alerts.map((alert) => (
          <View
            key={alert.id}
            style={[
              styles.alertCard,
              {
                borderColor: alert.borderColor,
                backgroundColor: alert.backgroundColor,
              },
            ]}
          >
            <View style={styles.alertContent}>
              <View style={styles.alertHeader}>
                <View style={styles.alertIconContainer}>
                  <Icon name={alert.icon} size={24} color={alert.iconColor} />
                </View>
                <View style={styles.alertTitleContainer}>
                  <TextWrapper
                    style={styles.alertTitle}
                    fontFamily={fonts.poppins.regular}
                  >
                    {alert.title}
                  </TextWrapper>
                  <View
                    style={[
                      styles.severityBadge,
                      { backgroundColor: alert.severityColor },
                    ]}
                  >
                    <TextWrapper
                      style={[
                        styles.severityText,
                        { color: alert.severityTextColor || "#FFFFFF" },
                      ]}
                      fontFamily={fonts.poppins.regular}
                    >
                      {alert.severity}
                    </TextWrapper>
                  </View>
                </View>
              </View>

              <TextWrapper
                style={styles.alertDescription}
                fontFamily={fonts.poppins.regular}
              >
                {alert.description}
              </TextWrapper>

              <View style={styles.alertDetails}>
                <View style={styles.alertDetailItem}>
                  <Icon name="location" size={14} color="#666666" />
                  <TextWrapper
                    style={styles.alertDetailText}
                    fontFamily={fonts.poppins.regular}
                  >
                    {alert.location}
                  </TextWrapper>
                </View>
                <View style={styles.alertDetailItem}>
                  <Icon name="time" size={14} color="#666666" />
                  <TextWrapper
                    style={styles.alertDetailText}
                    fontFamily={fonts.poppins.regular}
                  >
                    {alert.time}
                  </TextWrapper>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
};

export default SafetyAlertsScreen;
