import React from "react";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { LoginScreenNavigationProp } from "@navigation";
import { SCREENS } from "@shared-constants";
import { styles } from "./PasswordChangedScreen.style";

const PasswordChangedScreen: React.FC = () => {
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
          <Text
            style={styles.title}
            className="text-center text-normal font-bold"
          >
            Password Changed!
          </Text>
          <Text
            style={styles.description}
            className="text-center text-typography-500"
          >
            Your password has been successfully changed. You can now log in with
            your new password.
          </Text>
        </VStack>

        <Button size="xl" onPress={handleGoToLogin} style={styles.button}>
          <ButtonText>Back to Login</ButtonText>
        </Button>
      </VStack>
    </View>
  );
};

export default PasswordChangedScreen;
