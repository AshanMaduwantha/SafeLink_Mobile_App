import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { VStack } from "@/components/ui/vstack";
import { RootStackParamList } from "@navigation";
import { SCREENS } from "@shared-constants";
import GetStartedImage from "../../assets/getstarted.png";
import { styles } from "./GetStartedScreen.style";

type GetStartedScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof SCREENS.GET_STARTED
>;

const GetStartedScreen: React.FC = () => {
  const navigation = useNavigation<GetStartedScreenNavigationProp>();

  const handleGetStarted = () => {
    navigation.replace(SCREENS.LOGIN);
  };

  return (
    <View style={styles.container}>
      <VStack space="xl" className="flex-1 justify-between">
        {/* Top Section */}
        <View style={styles.topSection}>
          <Text style={styles.title}>Welcome to MobileApp</Text>
          <Text style={styles.description}>
            Your world of dance—organized, elegant, and always within reach.
          </Text>
        </View>

        {/* Middle Section - Image */}
        <View style={styles.middleSection}>
          <Image
            source={GetStartedImage}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Bottom Section - Button and Legal Text */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            onPress={handleGetStarted}
            style={styles.getStartedButton}
          >
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>

          <Text style={styles.legalText}>
            By proceeding, you confirm your agreement to our{" "}
            <Text style={styles.linkText}>Term of Service</Text> and{" "}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>
      </VStack>
    </View>
  );
};

export default GetStartedScreen;
