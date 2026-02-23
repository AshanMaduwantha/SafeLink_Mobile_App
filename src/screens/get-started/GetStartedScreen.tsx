import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@navigation";
import { SCREENS } from "@shared-constants";
import Icon from "react-native-vector-icons/Ionicons";
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
      <View style={styles.topSection}>
        <View style={styles.badgeIcon}>
          <Icon name="shield-checkmark" size={28} color="#fff" />
        </View>
        <Text style={styles.title}>Welcome to SafeLink</Text>
        <Text style={styles.description}>
          Your safety companion—always ready{"\n"}to protect you and connect you
          with{"\n"}help when you need it most.
        </Text>
      </View>

      <View style={styles.middleSection}>
        <View style={styles.cardsRow}>
          <View
            style={[
              styles.featureCard,
              styles.featureCardLeft,
              { backgroundColor: "#E53935" },
            ]}
          >
            <View style={styles.featureCardIcon}>
              <Icon name="alert-circle-outline" size={22} color="#fff" />
            </View>
            <Text style={styles.featureCardTitle}>Emergency{"\n"}SOS</Text>
          </View>

          <View
            style={[
              styles.featureCard,
              styles.featureCardCenter,
              { backgroundColor: "#EC407A" },
            ]}
          >
            <View style={styles.featureCardIcon}>
              <Icon name="people-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.featureCardTitle}>Women &{"\n"}Children</Text>
          </View>

          <View
            style={[
              styles.featureCard,
              styles.featureCardRight,
              { backgroundColor: "#F57C00" },
            ]}
          >
            <View style={styles.featureCardIcon}>
              <Icon name="warning-outline" size={22} color="#fff" />
            </View>
            <Text style={styles.featureCardTitle}>Traffic{"\n"}Violation</Text>
          </View>
        </View>

        <View style={styles.smallIconsRow}>
          <View style={styles.smallIconCircle}>
            <Icon name="call-outline" size={20} color="#2196F3" />
          </View>
          <View style={styles.smallIconCircle}>
            <Icon name="shield-outline" size={20} color="#4CAF50" />
          </View>
          <View style={styles.smallIconCircle}>
            <Icon name="heart-outline" size={20} color="#E91E63" />
          </View>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          onPress={handleGetStarted}
          style={styles.getStartedButton}
        >
          <Text style={styles.getStartedButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GetStartedScreen;
