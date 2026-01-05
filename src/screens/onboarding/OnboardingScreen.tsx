import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { VStack } from "@/components/ui/vstack";
import { RootStackParamList } from "@navigation";
import { SCREENS } from "@shared-constants";
import OnboardingScreen1Image from "../../assets/onboarding_screen1.png";
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
    // Navigate to get started screen
    navigation.replace(SCREENS.GET_STARTED);
  };

  return (
    <View style={styles.container}>
      <VStack space="xl" className="flex-1 justify-between">
        {/* Top Section */}
        <View style={styles.topSection}>
          <Text style={styles.title}>View Timetables</Text>
          <Text style={styles.description}>
            Instantly access your class schedules and updates, all in one
            elegant, easy-to-read view.
          </Text>
        </View>

        {/* Middle Section - Image */}
        <View style={styles.middleSection}>
          <Image
            source={OnboardingScreen1Image}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Pagination Dots */}
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

        {/* Bottom Section - Buttons */}
        <View style={styles.bottomSection}>
          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </VStack>
    </View>
  );
};

export default OnboardingScreen;
