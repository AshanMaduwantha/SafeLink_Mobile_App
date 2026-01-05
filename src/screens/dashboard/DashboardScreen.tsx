import React, { useState } from "react";
import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { Text } from "@/components/ui/text";
import { SCREENS } from "@shared-constants";
import { palette } from "@theme/themes";

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
      <View className="flex-1 px-6 pt-10">
        <View className="mb-10">
          <Text className="text-3xl font-bold text-black mb-2">Dashboard</Text>
          <Text className="text-gray-500">Broadcasting to admin portal</Text>
        </View>

        <TouchableOpacity
          onPress={handleStartLive}
          disabled={loading}
          activeOpacity={0.8}
          className="bg-primary p-6 rounded-3xl flex-row items-center justify-between shadow-lg shadow-primary/30"
          style={{ backgroundColor: palette.primary }}
        >
          <View className="flex-row items-center">
            <View className="bg-white/20 p-3 rounded-2xl mr-4">
              <Icon name="videocam" size={28} color="white" />
            </View>
            <View>
              <Text className="text-white text-xl font-semibold">
                Start Live Stream
              </Text>
              <Text className="text-white/70 text-sm">
                Broadcast using back camera
              </Text>
            </View>
          </View>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Icon name="chevron-forward" size={24} color="white" />
          )}
        </TouchableOpacity>

        <View className="mt-10 p-6 bg-gray-50 rounded-3xl border border-gray-100">
          <Text className="text-gray-800 font-semibold mb-2">
            Streaming Status
          </Text>
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-gray-300 mr-2" />
            <Text className="text-gray-500 italic">Offline</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DashboardScreen;
