import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";

const DashboardScreen: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center py-20 px-4">
        <Text className="text-black text-center font-medium">
          This is a Dashboard
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default DashboardScreen;
