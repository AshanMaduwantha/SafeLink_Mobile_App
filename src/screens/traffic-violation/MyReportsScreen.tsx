import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { Text } from "@/components/ui/text";

const MyReportsScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const reports = [
    {
      id: "RPT-2026-001234",
      title: "Over-speeding",
      status: "Under Review",
      location: "Main Street, Downtown",
      date: "Jan 6, 2026",
      statusColor: "#FBC02D", // Yellow
      statusBg: "#FFF9C4",
    },
    {
      id: "RPT-2026-001189",
      title: "Red Light Violation",
      status: "Action Taken",
      location: "Park Avenue & 5th St",
      date: "Jan 4, 2026",
      statusColor: "#4CAF50", // Green
      statusBg: "#E8F5E9",
    },
    {
      id: "RPT-2026-001145",
      title: "No Helmet",
      status: "Action Taken",
      location: "Oak Street",
      date: "Jan 2, 2026",
      statusColor: "#4CAF50",
      statusBg: "#E8F5E9",
    },
  ];

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
          My Report
        </Text>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Stats Row */}
        <View className="flex-row justify-between mb-8 px-2">
          <View className="items-center">
            <Text className="text-slate-800 text-xl font-bold">5</Text>
            <Text className="text-slate-400 text-xs">Total</Text>
          </View>
          <View className="items-center">
            <Text className="text-orange-500 text-xl font-bold">1</Text>
            <Text className="text-slate-400 text-xs">Reviewing</Text>
          </View>
          <View className="items-center">
            <Text className="text-green-500 text-xl font-bold">2</Text>
            <Text className="text-slate-400 text-xs">Resolved</Text>
          </View>
          <View className="items-center">
            <Text className="text-blue-500 text-xl font-bold">1</Text>
            <Text className="text-slate-400 text-xs">Pending</Text>
          </View>
        </View>

        {/* Reports List */}
        {reports.map((report) => (
          <View
            key={report.id}
            className="bg-white border border-gray-100 rounded-3xl p-5 mb-6 shadow-sm"
          >
            <View className="flex-row items-start mb-4">
              <View className="bg-gray-200 w-16 h-16 rounded-2xl items-center justify-center mr-4">
                <Icon name="camera" size={24} color="#666" />
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between items-start">
                  <Text className="text-slate-800 font-bold text-lg leading-tight flex-1">
                    {report.title}
                  </Text>
                  <View
                    className="px-3 py-1 rounded-full flex-row items-center"
                    style={{ backgroundColor: report.statusBg }}
                  >
                    <Icon
                      name={
                        report.status === "Action Taken"
                          ? "checkmark-circle-outline"
                          : "time-outline"
                      }
                      size={14}
                      color={report.statusColor}
                    />
                    <Text
                      className="text-xs font-bold ml-1"
                      style={{ color: report.statusColor }}
                    >
                      {report.status}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center mt-2">
                  <Icon name="location-outline" size={14} color="#666" />
                  <Text className="text-slate-500 text-xs ml-1">
                    {report.location}
                  </Text>
                </View>
                <View className="flex-row items-center mt-1">
                  <Icon name="calendar-outline" size={14} color="#666" />
                  <Text className="text-slate-500 text-xs ml-1">
                    {report.date}
                  </Text>
                </View>
              </View>
            </View>

            <View className="bg-gray-50 self-start px-3 py-1 rounded-lg mb-4">
              <Text className="text-slate-400 text-xs font-bold">
                {report.id}
              </Text>
            </View>

            <TouchableOpacity className="bg-gray-50 h-10 rounded-xl items-center justify-center">
              <Text className="text-slate-600 font-bold">View Details</Text>
            </TouchableOpacity>
          </View>
        ))}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyReportsScreen;
