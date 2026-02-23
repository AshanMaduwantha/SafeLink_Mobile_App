import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@navigation";
import { SCREENS } from "@shared-constants";
import Icon from "react-native-vector-icons/Ionicons";
import { styles } from "./OnboardingScreen.style";

type OnboardingScreen2NavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof SCREENS.ONBOARDING_2
>;

const OnboardingScreen2: React.FC = () => {
  const navigation = useNavigation<OnboardingScreen2NavigationProp>();

  const handleNext = () => {
    navigation.navigate(SCREENS.ONBOARDING_3);
  };

  const handleSkip = () => {
    navigation.replace(SCREENS.GET_STARTED);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.badgeIcon}>
          <Icon name="people" size={28} color="#fff" />
        </View>
        <Text style={styles.title}>Women & Children</Text>
        <Text style={styles.description}>
          Specialized protection for those who need it.{"\n"}Quick access to
          dedicated helplines,{"\n"}counseling services, and safe spaces.
        </Text>
      </View>

      <View style={styles.illustrationContainer}>
        <View style={styles.outerCircle}>
          <View style={styles.middleCircle}>
            <View style={styles.innerCircle}>
              <Icon name="heart" size={44} color="#fff" />
            </View>
          </View>
        </View>
        <View style={[styles.floatingCard, styles.floatTopLeft]}>
          <Icon name="people-outline" size={20} color="#E91E63" />
        </View>
        <View style={[styles.floatingCard, styles.floatTopRight]}>
          <Icon name="shield-outline" size={20} color="#7C4DFF" />
        </View>
        <View style={[styles.floatingCard, styles.floatBottomLeft]}>
          <Icon name="people-circle-outline" size={20} color="#2196F3" />
        </View>
        <View style={[styles.floatingCard, styles.floatBottomRight]}>
          <Icon name="happy-outline" size={20} color="#FF9800" />
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
            style={[styles.dot, styles.activeDot]}
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

export default OnboardingScreen2;
