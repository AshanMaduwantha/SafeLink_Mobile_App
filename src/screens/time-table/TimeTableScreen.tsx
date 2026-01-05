import React from "react";
import { Text, View } from "react-native";
import Screen from "@/components/Screen";
import styles from "./TimeTableScreen.style";

const TimeTableScreen = () => {
  return (
    <Screen style={styles.container}>
      <View className="flex-1 justify-center items-center py-20 px-4">
        <Text className="text-black text-center font-medium">
          This is a Screen2
        </Text>
      </View>
    </Screen>
  );
};

export default TimeTableScreen;
