import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { cssInterop } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { Text } from "@/components/ui/text";

const StyledIcon = Icon as any;

cssInterop(StyledIcon, {
  className: "style",
});

const ReportViolationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [vehicleType, setVehicleType] = useState("Car");

  const vehicleTypes = [
    { name: "Car", icon: "car-outline" },
    { name: "Motorcycle", icon: "bicycle-outline" }, // bicycle as closest for bike
    { name: "Truck", icon: "bus-outline" }, // using bus as placeholder for truck
    { name: "Bus", icon: "bus-outline" },
    { name: "Auto-rickshaw", icon: "construct-outline" }, // placeholder
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-6 py-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-gray-100 p-2 rounded-full mr-4"
        >
          <StyledIcon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-slate-800 flex-1 text-center mr-10">
          Report Violation
        </Text>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <Text className="text-slate-800 font-bold mb-4">Upload Evidence *</Text>
        <View className="border-2 border-dashed border-gray-200 rounded-3xl p-8 items-center mb-6">
          <View className="bg-blue-50 p-6 rounded-full mb-4">
            <StyledIcon name="cloud-upload-outline" size={48} color="#2176FF" />
          </View>
          <Text className="text-slate-800 font-bold text-lg mb-1">
            Upload Photo or Video
          </Text>
          <Text className="text-slate-400 text-sm mb-6">
            Click to browse from gallery
          </Text>

          <View className="flex-row gap-4">
            <TouchableOpacity className="bg-blue-600 px-6 py-3 rounded-xl flex-row items-center">
              <StyledIcon
                name="camera"
                size={20}
                color="white"
                className="mr-2"
              />
              <Text className="text-white font-bold ml-2">Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 px-6 py-3 rounded-xl">
              <Text className="text-slate-700 font-bold">Choose File</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-slate-800 font-bold mb-4">Location *</Text>
        <TouchableOpacity className="flex-row items-center bg-white border border-gray-100 rounded-2xl p-4 mb-6 shadow-sm">
          <StyledIcon
            name="location"
            size={24}
            color="#2176FF"
            className="mr-4"
          />
          <View className="flex-1 ml-4">
            <Text className="text-slate-800 font-bold">Current Location</Text>
            <Text className="text-slate-400 text-xs">
              Main Street, Downtown (Auto-detected)
            </Text>
          </View>
          <StyledIcon name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <Text className="text-slate-800 font-bold mb-4">Vehicle Type *</Text>
        <View className="flex-row flex-wrap gap-3 mb-6">
          {vehicleTypes.map((type) => (
            <TouchableOpacity
              key={type.name}
              onPress={() => setVehicleType(type.name)}
              className={`flex-row items-center border rounded-xl px-4 py-3 ${
                vehicleType === type.name
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-100 bg-white"
              }`}
            >
              <StyledIcon
                name={type.icon}
                size={20}
                color={vehicleType === type.name ? "#2176FF" : "#666"}
              />
              <Text
                className={`ml-2 font-bold ${
                  vehicleType === type.name ? "text-blue-600" : "text-slate-600"
                }`}
              >
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-slate-800 font-bold mb-4">
          Violation Category *
        </Text>
        <TouchableOpacity className="bg-gray-50 p-4 rounded-xl mb-6">
          <Text className="text-slate-400 font-bold">
            Select Violation Category
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-blue-600 h-16 rounded-2xl items-center justify-center mb-10 shadow-lg shadow-blue-300">
          <Text className="text-white text-lg font-bold">Submit Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportViolationScreen;
