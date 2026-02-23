import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { Text } from "@/components/ui/text";
import { SCREENS } from "@shared-constants";

const SafetyMonitorScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-6 py-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-gray-100 p-2 rounded-full mr-4"
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-slate-800 flex-1 text-center mr-10">
          Safety Monitor
        </Text>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Safety Level Card */}
        <View className="bg-green-500 rounded-3xl p-6 mb-6 shadow-md">
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-white/80 text-sm mb-1">
                Current Road Safety Level
              </Text>
              <Text className="text-white text-4xl font-bold mb-4">Safe</Text>
            </View>
            <View className="bg-white/20 p-3 rounded-2xl">
              <Icon name="shield-checkmark" size={32} color="white" />
            </View>
          </View>
          <Text className="text-white text-sm mb-6">
            Road conditions in your area are favorable. Drive safely and stay
            alert.
          </Text>
          <View className="flex-row justify-between items-center border-t border-white/20 pt-4">
            <Text className="text-white/60 text-xs">Last updated:</Text>
            <Text className="text-white text-xs">Just now</Text>
          </View>
        </View>

        {/* Action Options */}
        <TouchableOpacity
          onPress={() => navigation.navigate(SCREENS.REPORT_VIOLATION)}
          activeOpacity={0.7}
          className="flex-row items-center bg-white border border-blue-500 rounded-2xl p-4 mb-4"
        >
          <View className="bg-blue-50 p-3 rounded-xl mr-4">
            <Icon name="camera-outline" size={24} color="#2176FF" />
          </View>
          <View className="flex-1">
            <Text className="text-slate-800 font-bold text-lg">
              Report Traffic Violation
            </Text>
            <Text className="text-slate-500 text-xs">
              Upload evidence and submit report
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate(SCREENS.DRIVE_MODE)}
          activeOpacity={0.7}
          className="flex-row items-center bg-white border border-orange-500 rounded-2xl p-4 mb-4"
        >
          <View className="bg-orange-50 p-3 rounded-xl mr-4">
            <Icon name="notifications-outline" size={24} color="#E67E00" />
          </View>
          <View className="flex-1">
            <Text className="text-slate-800 font-bold text-lg">
              Accident Risk Alerts
            </Text>
            <Text className="text-slate-500 text-xs">
              Enable real-time driving alerts
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate(SCREENS.MY_REPORTS)}
          activeOpacity={0.7}
          className="flex-row items-center bg-white border border-purple-500 rounded-2xl p-4 mb-6"
        >
          <View className="bg-purple-50 p-3 rounded-xl mr-4">
            <Icon name="document-text-outline" size={24} color="#8E24AA" />
          </View>
          <View className="flex-1">
            <Text className="text-slate-800 font-bold text-lg">My Reports</Text>
            <Text className="text-slate-500 text-xs">
              View submitted violation reports
            </Text>
          </View>
        </TouchableOpacity>

        {/* Contribution Stats */}
        <View className="bg-white border border-gray-100 rounded-3xl p-6 mb-8 shadow-sm">
          <Text className="text-slate-800 font-bold text-lg text-center mb-6">
            Your Contribution
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <Text className="text-blue-600 text-2xl font-bold">12</Text>
              <Text className="text-slate-400 text-xs text-center">
                Reports
              </Text>
            </View>
            <View className="w-px h-10 bg-gray-100" />
            <View className="items-center flex-1">
              <Text className="text-green-600 text-2xl font-bold">8</Text>
              <Text className="text-slate-400 text-xs text-center">
                Resolved
              </Text>
            </View>
            <View className="w-px h-10 bg-gray-100" />
            <View className="items-center flex-1">
              <Text className="text-orange-600 text-2xl font-bold">4</Text>
              <Text className="text-slate-400 text-xs text-center">
                Pending
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SafetyMonitorScreen;
