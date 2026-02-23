import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@navigation";
import { SCREENS } from "@shared-constants";
import Icon from "react-native-vector-icons/Ionicons";
import { styles } from "./OnboardingScreen.style";

type OnboardingScreen3NavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof SCREENS.ONBOARDING_3
>;

const OnboardingScreen3: React.FC = () => {
  const navigation = useNavigation<OnboardingScreen3NavigationProp>();

  const handleNext = () => {
    navigation.replace(SCREENS.GET_STARTED);
  };

  const handleSkip = () => {
    navigation.replace(SCREENS.GET_STARTED);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.badgeIcon}>
          <Icon name="warning" size={28} color="#fff" />
        </View>
        <Text style={styles.title}>Traffic Violation</Text>
        <Text style={styles.description}>
          Report traffic incidents and violations instantly.{"\n"}Capture
          evidence, share location,{"\n"}and connect with authorities quickly.
        </Text>
      </View>

      <View style={styles.illustrationContainer}>
        <View style={styles.outerCircle}>
          <View style={styles.middleCircle}>
            <View style={styles.innerCircle}>
              <Icon name="warning-outline" size={44} color="#fff" />
            </View>
          </View>
        </View>
        <View style={[styles.floatingCard, styles.floatTopLeft]}>
          <Icon name="car-outline" size={20} color="#FF9800" />
        </View>
        <View style={[styles.floatingCard, styles.floatTopRight]}>
          <Icon name="camera-outline" size={20} color="#2196F3" />
        </View>
        <View style={[styles.floatingCard, styles.floatBottomLeft]}>
          <Icon name="location-outline" size={20} color="#E53935" />
        </View>
        <View style={[styles.floatingCard, styles.floatBottomRight]}>
          <Icon name="document-text-outline" size={20} color="#4CAF50" />
        </View>
      </View>

      <View style={styles.paginationContainer}>
        <View style={styles.paginationDots}>
          <TouchableOpacity
            style={styles.dot}
            onPress={() => navigation.navigate(SCREENS.ONBOARDING)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          />
          <TouchableOpacity
            style={styles.dot}
            onPress={() => navigation.navigate(SCREENS.ONBOARDING_2)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          />
          <TouchableOpacity
            style={[styles.dot, styles.activeDot]}
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

export default OnboardingScreen3;
