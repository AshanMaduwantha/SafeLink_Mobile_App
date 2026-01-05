import React from "react";
import { Image, StatusBar, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Title from "@/assets/Title.png";
import Screen from "@/components/Screen";
import TextWrapper from "@/shared/components/text-wrapper/TextWrapper";
import fonts from "@/shared/theme/fonts";
import { styles } from "./AboutScreen.style";

interface AboutScreenProps {
  navigation: any;
}

const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
  return (
    <Screen style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-back"
            size={24}
            color="#374151"
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <TextWrapper
          style={styles.headerTitle}
          fontFamily={fonts.poppins.regular}
          className="text-2xl font-bold mr-10"
        >
          About
        </TextWrapper>
        <View style={styles.spacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoWrap}>
          <Image source={Title} resizeMode="contain" style={styles.logo} />
        </View>

        {/* App title and tagline */}
        <TextWrapper style={styles.appTitle} fontFamily={fonts.poppins.regular}>
          StudioMate
        </TextWrapper>
        <TextWrapper
          style={styles.appSubtitle}
          fontFamily={fonts.poppins.regular}
        >
          Learn, practice, and perfect your moves.
        </TextWrapper>

        {/* Info cards */}
        <View style={styles.card}>
          <TextWrapper
            style={styles.cardTitle}
            fontFamily={fonts.poppins.regular}
          >
            App Information
          </TextWrapper>
          <View style={styles.row}>
            <TextWrapper
              style={styles.rowLabel}
              fontFamily={fonts.poppins.regular}
            >
              Version
            </TextWrapper>
            <TextWrapper
              style={styles.rowValue}
              fontFamily={fonts.poppins.regular}
            >
              1.3.2
            </TextWrapper>
          </View>
          <View style={styles.row}>
            <TextWrapper
              style={styles.rowLabel}
              fontFamily={fonts.poppins.regular}
            >
              Developer
            </TextWrapper>
            <TextWrapper
              style={styles.rowValue}
              fontFamily={fonts.poppins.regular}
            >
              XGenLabs
            </TextWrapper>
          </View>
        </View>

        <View style={styles.section}>
          <TextWrapper
            style={styles.sectionTitle}
            fontFamily={fonts.poppins.regular}
          >
            About this app
          </TextWrapper>
          <TextWrapper
            style={styles.sectionText}
            fontFamily={fonts.poppins.regular}
          >
            Discover classes, manage your schedule, enroll in courses, and stay
            updated with academy news and notifications.
          </TextWrapper>
        </View>
      </View>
    </Screen>
  );
};

// styles moved to AboutScreen.style.ts

export default AboutScreen;
