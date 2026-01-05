import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import Icon from "react-native-vector-icons/Ionicons";
import { getAuth } from "@react-native-firebase/auth";
import { getUserProfile } from "../services/user/user.service";
import TextWrapper from "../shared/components/text-wrapper/TextWrapper";
import fonts from "../shared/theme/fonts";

interface QRCodeDropdownProps {
  qrValue?: string;
}

const QRCodeDropdown: React.FC<QRCodeDropdownProps> = ({ qrValue }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [resolvedValue, setResolvedValue] = useState<string>("");

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  React.useEffect(() => {
    let isMounted = true;
    const resolve = async () => {
      try {
        if (qrValue) {
          if (isMounted) setResolvedValue(qrValue);
          return;
        }
        const { currentUser } = getAuth();
        if (!currentUser) {
          if (isMounted) setResolvedValue("");
          return;
        }
        const profile = await getUserProfile(currentUser.uid);
        const memberId = (profile as any)?.memberId || "";
        if (isMounted) setResolvedValue(memberId);
      } catch {
        if (isMounted) setResolvedValue("");
      }
    };
    //eslint-disable-next-line @typescript-eslint/no-floating-promises
    resolve();
    return () => {
      isMounted = false;
    };
  }, [qrValue]);

  return (
    <View className="bg-white rounded-lg mb-5">
      <TouchableOpacity
        onPress={toggleExpanded}
        className="flex-row items-center justify-between p-4"
        activeOpacity={0.7}
      >
        <View className="flex-row items-center flex-1">
          <View className="flex-row items-center mr-3">
            <View className="w-8 h-8 bg-gray-100 rounded items-center justify-center">
              <Icon name="qr-code-outline" size={20} color="#2176FF" />
            </View>
          </View>
          <View className="flex-1">
            <TextWrapper
              fontFamily={fonts.poppins.regular}
              className="text-base"
              style={styles.qrCodeText}
            >
              {isExpanded ? "Hide QR Code" : "Show QR Code"}
            </TextWrapper>
            <TextWrapper
              fontFamily={fonts.poppins.regular}
              className="text-sm text-gray-500 mt-0.5"
            >
              Scan to check-in to your classes
            </TextWrapper>
          </View>
        </View>
        <Icon
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View className="px-4 pb-4">
          <View className="items-center justify-center py-6">
            <View
              className="bg-white p-4 rounded-lg"
              style={styles.qrCodeContainer}
            >
              <QRCode
                value={resolvedValue || ""}
                size={250}
                color="#000000"
                backgroundColor="#FFFFFF"
              />
            </View>
          </View>
          <TextWrapper
            fontFamily={fonts.poppins.regular}
            className="text-sm text-gray-500 text-center mt-2"
          >
            Have your instructor scan this code to check-in to their classes
          </TextWrapper>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  qrCodeText: {
    color: "#000",
    fontWeight: "bold",
  },
  qrCodeContainer: {
    borderWidth: 2,
    borderColor: "#2176FF",
  },
});

export default QRCodeDropdown;
