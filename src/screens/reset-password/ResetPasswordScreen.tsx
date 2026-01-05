import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { LoginScreenNavigationProp } from "@navigation";
import auth from "@react-native-firebase/auth";
import { SCREENS } from "@shared-constants";
import { styles } from "./ResetPasswordScreen.style";

interface ResetPasswordRouteParams {
  oobCode?: string;
}

const ResetPasswordScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const route = useRoute();
  const { oobCode } = route.params as ResetPasswordRouteParams;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      Alert.alert(
        "Error",
        "Invalid password reset link. Please try again from the forgot password flow.",
      );
      navigation.navigate(SCREENS.LOGIN);
    }
  }, [oobCode, navigation]);

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (!oobCode) {
      Alert.alert("Error", "Missing reset code.");
      return;
    }

    setLoading(true);
    try {
      await auth().confirmPasswordReset(oobCode, newPassword);
      Alert.alert("Success", "Your password has been reset successfully!");
      navigation.navigate(SCREENS.PASSWORD_CHANGED);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    navigation.navigate(SCREENS.LOGIN);
  };

  return (
    <View
      className="flex-1 justify-center items-center bg-background-0"
      style={styles.container}
    >
      <VStack space="xl" className="w-full max-w-sm mb-55">
        <View style={styles.titleSection}>
          <VStack space="md" className="items-center">
            <Text
              style={styles.title}
              className="text-center text-normal font-bold"
            >
              Reset your password
            </Text>
            <Text
              style={styles.description}
              className="text-center text-typography-500"
            >
              Enter your new password below.
            </Text>
          </VStack>
        </View>

        <FormControl style={styles.formControl}>
          <VStack space="xs">
            <FormControlLabel>
              <FormControlLabelText className="text-typography-900">
                New Password
              </FormControlLabelText>
            </FormControlLabel>
            <Input style={styles.input}>
              <InputField
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                style={styles.inputField}
              />
            </Input>
          </VStack>
        </FormControl>

        <FormControl style={styles.formControl}>
          <VStack space="xs">
            <FormControlLabel>
              <FormControlLabelText className="text-typography-900">
                Confirm New Password
              </FormControlLabelText>
            </FormControlLabel>
            <Input style={styles.input}>
              <InputField
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.inputField}
              />
            </Input>
          </VStack>
        </FormControl>

        <Button
          size="xl"
          onPress={handleResetPassword}
          disabled={loading}
          style={styles.resetButton}
        >
          <ButtonText>{loading ? "Resetting..." : "Reset Password"}</ButtonText>
        </Button>

        <View style={styles.footerSection}>
          <HStack space="xs" className="justify-center items-center">
            <Text style={styles.footerText}>Remember password? </Text>
            <TouchableOpacity onPress={handleSignIn}>
              <Text style={styles.signInLink}>Sign in</Text>
            </TouchableOpacity>
          </HStack>
        </View>
      </VStack>
    </View>
  );
};

export default ResetPasswordScreen;
