import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";
import { Text } from "@/components/ui/text";
import { RootStackParamList } from "@/navigation";
import { SCREENS } from "@shared-constants";
import { styles } from "./BottomNavbar.style";

type BottomNavbarProps = {
  activeTab?: "home" | "booknow" | "courses" | "profile";
};

type BottomNavbarNavigationProp = StackNavigationProp<RootStackParamList>;

const BottomNavbar: React.FC<BottomNavbarProps> = ({ activeTab = "home" }) => {
  const navigation = useNavigation<BottomNavbarNavigationProp>();

  const getIconColor = (tab: string) => {
    return activeTab === tab ? "#007AFF" : "#6B7280";
  };

  const getTextStyle = (tab: string) => {
    return activeTab === tab
      ? styles.bottomNavTextActive
      : styles.bottomNavText;
  };

  return (
    <View style={styles.bottomNav}>
      <View style={styles.bottomNavContent}>
        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() =>
            navigation.navigate(SCREENS.ROOT, { screen: SCREENS.HOME })
          }
        >
          <Icon name="home-outline" size={24} color={getIconColor("home")} />
          <Text style={getTextStyle("home")}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() =>
            navigation.navigate(SCREENS.ROOT, { screen: SCREENS.TIME_TABLE })
          }
        >
          <Icon
            name="calendar-outline"
            size={24}
            color={getIconColor("booknow")}
          />
          <Text style={getTextStyle("booknow")}>Book Now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() =>
            navigation.navigate(SCREENS.ROOT, { screen: SCREENS.COURSES })
          }
        >
          <Icon name="grid-outline" size={24} color={getIconColor("booknow")} />
          <Text style={getTextStyle("booknow")}>My Schedule</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() =>
            navigation.navigate(SCREENS.ROOT, { screen: SCREENS.PROFILE })
          }
        >
          <Icon
            name="person-outline"
            size={24}
            color={getIconColor("profile")}
          />
          <Text style={getTextStyle("profile")}>You</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomNavbar;
