import React, { useState } from "react";
import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { SCREENS } from "@shared-constants";

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);

  const handleStartLive = async () => {
    setLoading(true);
    try {
      const meetingId = "live_stream_channel";
      navigation.navigate(SCREENS.LIVE_STREAM, { meetingId });
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message ||
          "Failed to start live stream. Please check your connection.",
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 justify-center">
        {/* Emergency SOS Button */}
        <TouchableOpacity
          onPress={handleStartLive}
          disabled={loading}
          activeOpacity={0.8}
          className="h-20 rounded-2xl items-center justify-center shadow-lg mb-4"
          style={{ backgroundColor: "#E60000" }} // Bright Red
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-2xl font-bold">Emergency SOS</Text>
          )}
        </TouchableOpacity>

        {/* Women & Children Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate(SCREENS.SAFETY_MONITOR_WOMEN_CHILDREN)}
          activeOpacity={0.8}
          className="h-20 rounded-2xl items-center justify-center shadow-lg mb-4"
          style={{ backgroundColor: "#E91E63" }} // Pink
        >
          <Text className="text-white text-2xl font-bold">Women & Children</Text>
        </TouchableOpacity>

        {/* Traffic Violation Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate(SCREENS.SAFETY_MONITOR)}
          activeOpacity={0.8}
          className="h-20 rounded-2xl items-center justify-center shadow-lg"
          style={{ backgroundColor: "#E67E00" }} // Strong Orange
        >
          <Text className="text-white text-2xl font-bold">Traffic Violation</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DashboardScreen;
