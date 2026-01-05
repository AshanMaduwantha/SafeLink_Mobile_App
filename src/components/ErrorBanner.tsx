import React from "react";
import { Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface ErrorBannerProps {
  message: string;
  className?: string;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, className }) => {
  return (
    <View
      className={`bg-red-50 border border-red-200 rounded-md p-3 ${className || ""}`}
    >
      <View className="flex-row items-center">
        <Icon name="warning-outline" size={20} color="#DC2626" />
        <Text className="ml-2 text-red-700">{message}</Text>
      </View>
    </View>
  );
};

export default ErrorBanner;
