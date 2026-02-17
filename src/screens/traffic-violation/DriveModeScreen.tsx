import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { Text } from "@/components/ui/text";

const DriveModeScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-6 py-4 justify-between">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-gray-100 p-2 rounded-full"
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-slate-800">Drive Mode</Text>
        <View className="bg-green-500 px-4 py-2 rounded-full">
          <Text className="text-white font-bold">Active</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Risk Zone Alert */}
        <View className="bg-red-50 border border-red-200 rounded-3xl p-6 mb-6">
          <View className="flex-row items-center mb-4">
            <View className="bg-red-500 p-3 rounded-2xl mr-4">
              <Icon name="alert-circle" size={32} color="white" />
            </View>
            <View>
              <Text className="text-red-800 text-xl font-bold">
                High Risk Zone
              </Text>
              <Text className="text-red-500">Ahead on your route</Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-6">
            <View>
              <Text className="text-slate-500 mb-1">Distance</Text>
              <Text className="text-red-600 text-2xl font-bold">0.8 km</Text>
            </View>
            <View className="items-end">
              <Text className="text-slate-500 mb-1">Accident Probability</Text>
              <Text className="text-red-600 text-2xl font-bold">78%</Text>
            </View>
          </View>

          <View className="bg-red-600 rounded-2xl p-4">
            <View className="flex-row items-center mb-3">
              <Icon name="warning" size={20} color="white" />
              <Text className="text-white font-bold ml-2">
                Safety Recommendations:
              </Text>
            </View>
            <View className="space-y-1">
              <Text className="text-white">• Reduce speed immediately</Text>
              <Text className="text-white">
                • Maintain safe following distance
              </Text>
              <Text className="text-white">• Stay alert for sudden stops</Text>
              <Text className="text-white">• Consider alternative route</Text>
            </View>
          </View>
        </View>

        {/* Route Overview Section */}
        <Text className="text-slate-800 font-bold mb-4 text-lg">
          Route Overview
        </Text>
        <View className="bg-gray-50 rounded-3xl p-6 mb-6 items-center border border-gray-100">
          {/* Dummy Map Visual */}
          <View className="w-full h-48 justify-center items-center">
            <View className="w-full h-px bg-blue-400 opacity-30 absolute transform -rotate-45" />
            <View className="bg-blue-500 p-2 rounded-full absolute left-10 bottom-10">
              <Icon name="navigate" size={20} color="white" />
            </View>
            <View className="bg-red-100/50 w-24 h-24 rounded-full absolute items-center justify-center">
              <View className="bg-red-500 w-4 h-4 rounded-full" />
              <View className="bg-red-500/20 w-16 h-16 rounded-full absolute" />
            </View>
            <View className="bg-red-600 p-2 rounded-full absolute right-10 top-10">
              <Icon name="flag" size={20} color="white" />
            </View>
          </View>
        </View>

        {/* Trip Statistics Section */}
        <Text className="text-slate-800 font-bold mb-4 text-lg">
          Trip Statistics
        </Text>
        <View className="flex-row gap-4 mb-20">
          <View className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 items-center">
            <Icon name="speedometer-outline" size={24} color="#666" />
            <Text className="text-slate-800 font-bold mt-2">Avg Speed</Text>
            <Text className="text-slate-400 text-xs text-center">45 km/h</Text>
          </View>
          <View className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 items-center">
            <Icon name="time-outline" size={24} color="#666" />
            <Text className="text-slate-800 font-bold mt-2">Duration</Text>
            <Text className="text-slate-400 text-xs text-center">18 mins</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DriveModeScreen;
