import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import Screen from "@/components/Screen";
import TextWrapper from "@/shared/components/text-wrapper/TextWrapper";
import fonts from "@/shared/theme/fonts";
import { SCREENS } from "@shared-constants";
import { styles } from "./styles/SafetyMonitorWomenChildrenScreen.style";

const SafetyMonitorWomenChildrenScreen = () => {
  const navigation = useNavigation<any>();

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
          Safety Monitor
        </TextWrapper>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Safety Level Card */}
        <View style={styles.safetyLevelCard}>
          <View style={styles.safetyLevelHeader}>
            <TextWrapper
              style={styles.safetyLevelTitle}
              fontFamily={fonts.poppins.regular}
            >
              Current Safety Level
            </TextWrapper>
            <View style={styles.shieldIconContainer}>
              <Icon name="shield-outline" size={24} color="#FFC300" />
            </View>
          </View>

          {/* Visual Bars */}
          <View style={styles.barsContainer}>
            <View style={[styles.bar, styles.barShort]} />
            <View style={[styles.bar, styles.barMedium]} />
            <View style={[styles.bar, styles.barTall]} />
          </View>

          {/* Safety Status */}
          <TextWrapper
            style={styles.safetyStatus}
            fontFamily={fonts.poppins.regular}
          >
            Medium
          </TextWrapper>

          {/* Description */}
          <TextWrapper
            style={styles.safetyDescription}
            fontFamily={fonts.poppins.regular}
          >
            Based on real-time data analysis
          </TextWrapper>
        </View>

        {/* Quick Actions Section */}
        <TextWrapper
          style={styles.quickActionsTitle}
          fontFamily={fonts.poppins.regular}
        >
          Quick Actions
        </TextWrapper>

        {/* View Heatmap Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate(SCREENS.VIEW_HEATMAP)}
          activeOpacity={0.8}
        >
          <View style={[styles.actionButtonContent, styles.heatmapButton]}>
            <Icon name="location" size={24} color="#FFFFFF" />
            <TextWrapper
              style={styles.actionButtonText}
              fontFamily={fonts.poppins.regular}
            >
              View Heatmap
            </TextWrapper>
            <Icon name="chevron-forward" size={24} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        {/* Alerts Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate(SCREENS.SAFETY_ALERTS)}
          activeOpacity={0.8}
        >
          <View style={[styles.actionButtonContent, styles.alertsButton]}>
            <Icon name="warning" size={24} color="#FFFFFF" />
            <TextWrapper
              style={styles.actionButtonText}
              fontFamily={fonts.poppins.regular}
            >
              Alerts
            </TextWrapper>
            <Icon name="chevron-forward" size={24} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        {/* Safety Insights Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate(SCREENS.SAFETY_INSIGHTS)}
          activeOpacity={0.8}
        >
          <View style={[styles.actionButtonContent, styles.insightsButton]}>
            <Icon name="trending-up" size={24} color="#FFFFFF" />
            <TextWrapper
              style={styles.actionButtonText}
              fontFamily={fonts.poppins.regular}
            >
              Safety Insights
            </TextWrapper>
            <Icon name="chevron-forward" size={24} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
};

export default SafetyMonitorWomenChildrenScreen;
