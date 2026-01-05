import React from "react";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { LoginScreenNavigationProp } from "@navigation";
import { SCREENS } from "@shared-constants";
import { styles } from "./PasswordResetEmailSentScreen.style";

const PasswordResetEmailSentScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleGoToLogin = () => {
    navigation.navigate(SCREENS.LOGIN);
  };

  return (
    <View
      className="flex-1 justify-center items-center bg-background-0"
      style={styles.container}
    >
      <VStack space="xl" className="w-full max-w-sm mb-55">
        <VStack space="md" className="items-center">
          <Icon name="check-circle" size={80} color="#22c55e" />
          <Text
            style={styles.title}
            className="text-center text-normal font-bold"
          >
            Password Reset Email Sent!
          </Text>
          <Text
            style={styles.description}
            className="text-center text-typography-500"
          >
            We have sent a password reset link to your email address if it is
            registered with us. Please check your inbox and follow the
            instructions to reset your password
          </Text>
        </VStack>

        <Button size="xl" onPress={handleGoToLogin} style={styles.button}>
          <ButtonText>Back to Login</ButtonText>
        </Button>
      </VStack>
    </View>
  );
};

export default PasswordResetEmailSentScreen;
