import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import Screen from "@/components/Screen";
import TextWrapper from "@/shared/components/text-wrapper/TextWrapper";
import fonts from "@/shared/theme/fonts";
import { styles } from "./styles/SafetyInsightsScreen.style";

const SafetyInsightsScreen = () => {
  const navigation = useNavigation<any>();

  const insights = [
    {
      id: 1,
      title: "High-risk zones visited",
      value: "3",
      timeframe: "This month",
      details: "Downtown Plaza, Market District, Oak Street area",
      icon: "location",
      iconColor: "#FF6B35",
      iconBgColor: "#FFE5D9",
    },
    {
      id: 2,
      title: "Most risky travel time",
      value: "8-10 PM",
      description: "Peak risk period",
      advice:
        "Consider alternative routes or travel with company during these hours",
      icon: "time",
      iconColor: "#FF6B35",
      iconBgColor: "#FFE5D9",
    },
    {
      id: 3,
      title: "Frequent incident type",
      value: "Poor Lighting",
      description: "Most common in your area",
      advice:
        "Carry a flashlight and stay on well-lit main streets when possible",
      icon: "warning",
      iconColor: "#FFA500",
      iconBgColor: "#FFF4E6",
    },
    {
      id: 4,
      title: "Weekly safety score",
      value: "75",
      description: "Above average",
      advice: "Continue following safety recommendations",
      icon: "trending-up",
      iconColor: "#4CAF50",
      iconBgColor: "#E8F5E9",
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
          Safety Insights
        </TextWrapper>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {insights.map((insight) => (
          <View key={insight.id} style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: insight.iconBgColor },
                ]}
              >
                <Icon name={insight.icon} size={24} color={insight.iconColor} />
              </View>
              <View style={styles.insightContent}>
                <TextWrapper
                  style={styles.insightTitle}
                  fontFamily={fonts.poppins.regular}
                >
                  {insight.title}
                </TextWrapper>
                <TextWrapper
                  style={[styles.insightValue, { color: insight.iconColor }]}
                  fontFamily={fonts.poppins.regular}
                >
                  {insight.value}
                </TextWrapper>
                {insight.timeframe && (
                  <TextWrapper
                    style={styles.insightTimeframe}
                    fontFamily={fonts.poppins.regular}
                  >
                    {insight.timeframe}
                  </TextWrapper>
                )}
                {insight.description && (
                  <TextWrapper
                    style={styles.insightDescription}
                    fontFamily={fonts.poppins.regular}
                  >
                    {insight.description}
                  </TextWrapper>
                )}
                {insight.details && (
                  <TextWrapper
                    style={styles.insightDetails}
                    fontFamily={fonts.poppins.regular}
                  >
                    {insight.details}
                  </TextWrapper>
                )}
                {insight.advice && (
                  <TextWrapper
                    style={styles.insightAdvice}
                    fontFamily={fonts.poppins.regular}
                  >
                    {insight.advice}
                  </TextWrapper>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
};

export default SafetyInsightsScreen;
