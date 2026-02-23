import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@navigation";
import { SCREENS } from "@shared-constants";
import Icon from "react-native-vector-icons/Ionicons";
import { styles } from "./OnboardingScreen.style";

type OnboardingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof SCREENS.ONBOARDING
>;

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();

  const handleNext = () => {
    navigation.navigate(SCREENS.ONBOARDING_2);
  };

  const handleSkip = () => {
    navigation.replace(SCREENS.GET_STARTED);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.badgeIcon}>
          <Icon name="alert-circle" size={28} color="#fff" />
        </View>
        <Text style={styles.title}>Emergency SOS</Text>
        <Text style={styles.description}>
          Get instant help when you need it most.{"\n"}One tap connects you to
          emergency services{"\n"}and alerts your trusted contacts.
        </Text>
      </View>

      <View style={styles.illustrationContainer}>
        <View style={styles.outerCircle}>
          <View style={styles.middleCircle}>
            <View style={styles.innerCircle}>
              <Icon name="alert-circle-outline" size={48} color="#fff" />
            </View>
          </View>
        </View>
        <View style={[styles.floatingCard, styles.floatTopLeft]}>
          <Icon name="call-outline" size={20} color="#E53935" />
        </View>
        <View style={[styles.floatingCard, styles.floatTopRight]}>
          <Icon name="shield-outline" size={20} color="#2196F3" />
        </View>
        <View style={[styles.floatingCard, styles.floatBottomLeft]}>
          <Icon name="flash-outline" size={20} color="#FF9800" />
        </View>
      </View>

      <View style={styles.paginationContainer}>
        <View style={styles.paginationDots}>
          <TouchableOpacity
            style={[styles.dot, styles.activeDot]}
            onPress={() => navigation.navigate(SCREENS.ONBOARDING)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          />
          <TouchableOpacity
            style={styles.dot}
            onPress={() => navigation.navigate(SCREENS.ONBOARDING_2)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          />
          <TouchableOpacity
            style={styles.dot}
            onPress={() => navigation.navigate(SCREENS.ONBOARDING_3)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          />
        </View>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;
