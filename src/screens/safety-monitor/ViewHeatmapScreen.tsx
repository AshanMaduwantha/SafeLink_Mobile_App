import React, { useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import Screen from "@/components/Screen";
import TextWrapper from "@/shared/components/text-wrapper/TextWrapper";
import fonts from "@/shared/theme/fonts";
import { styles } from "./styles/ViewHeatmapScreen.style";

const ViewHeatmapScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedFilter, setSelectedFilter] = useState<"women" | "children">(
    "women",
  );

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
          View Heatmap
        </TextWrapper>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={20}
            color="#A0A0A0"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search location..."
            placeholderTextColor="#A0A0A0"
          />
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === "women" && styles.filterButtonWomenActive,
            ]}
            onPress={() => setSelectedFilter("women")}
            activeOpacity={0.8}
          >
            <TextWrapper
              style={[
                styles.filterButtonText,
                selectedFilter === "women" && styles.filterButtonTextActive,
              ]}
              fontFamily={fonts.poppins.regular}
            >
              Women
            </TextWrapper>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === "children" &&
                styles.filterButtonChildrenActive,
            ]}
            onPress={() => setSelectedFilter("children")}
            activeOpacity={0.8}
          >
            <TextWrapper
              style={[
                styles.filterButtonText,
                selectedFilter === "children" && styles.filterButtonTextActive,
              ]}
              fontFamily={fonts.poppins.regular}
            >
              Children
            </TextWrapper>
          </TouchableOpacity>
        </View>

        {/* Map Container */}
        <View style={styles.mapContainer}>
          {/* Map Background - Simulated with View */}
          <View style={styles.mapBackground}>
            {/* Street Names */}
            <View style={styles.streetNameContainer}>
              <TextWrapper
                style={styles.streetName}
                fontFamily={fonts.poppins.regular}
              >
                Park Ave
              </TextWrapper>
              <TextWrapper
                style={styles.streetName}
                fontFamily={fonts.poppins.regular}
              >
                Main St
              </TextWrapper>
              <TextWrapper
                style={styles.streetName}
                fontFamily={fonts.poppins.regular}
              >
                Oak Rd
              </TextWrapper>
              <TextWrapper
                style={styles.streetName}
                fontFamily={fonts.poppins.regular}
              >
                1st Ave
              </TextWrapper>
            </View>

            {/* Heatmap Overlays - Simulated with colored circles */}
            <View style={styles.heatmapOverlay}>
              {/* Red areas */}
              <View style={[styles.heatmapBlur, styles.heatmapRed1]} />
              <View style={[styles.heatmapBlur, styles.heatmapRed2]} />
              {/* Orange area */}
              <View style={[styles.heatmapBlur, styles.heatmapOrange]} />
              {/* Yellow area */}
              <View style={[styles.heatmapBlur, styles.heatmapYellow]} />
              {/* Green area */}
              <View style={[styles.heatmapBlur, styles.heatmapGreen]} />
            </View>

            {/* Map Controls */}
            <View style={styles.mapControls}>
              <TouchableOpacity style={styles.mapControlButton}>
                <Icon name="add" size={20} color="#333333" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.mapControlButton}>
                <Icon name="remove" size={20} color="#333333" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.mapControlButton}>
                <Icon name="locate" size={20} color="#333333" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Risk Levels Legend */}
          <View style={styles.legendContainer}>
            <TextWrapper
              style={styles.legendTitle}
              fontFamily={fonts.poppins.regular}
            >
              Risk Levels
            </TextWrapper>
            <View style={styles.legendItems}>
              <View style={styles.legendItem}>
                <View style={[styles.legendCircle, styles.legendGreen]} />
                <TextWrapper
                  style={styles.legendText}
                  fontFamily={fonts.poppins.regular}
                >
                  Safe
                </TextWrapper>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendCircle, styles.legendYellow]} />
                <TextWrapper
                  style={styles.legendText}
                  fontFamily={fonts.poppins.regular}
                >
                  Low
                </TextWrapper>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendCircle, styles.legendOrange]} />
                <TextWrapper
                  style={styles.legendText}
                  fontFamily={fonts.poppins.regular}
                >
                  Medium
                </TextWrapper>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendCircle, styles.legendRed]} />
                <TextWrapper
                  style={styles.legendText}
                  fontFamily={fonts.poppins.regular}
                >
                  High
                </TextWrapper>
              </View>
            </View>
          </View>
        </View>

        {/* Footer Instruction */}
        <TextWrapper
          style={styles.footerInstruction}
          fontFamily={fonts.poppins.regular}
        >
          Tap an area to view details
        </TextWrapper>
      </ScrollView>
    </Screen>
  );
};

export default ViewHeatmapScreen;
