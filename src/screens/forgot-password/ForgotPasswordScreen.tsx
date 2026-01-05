import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { showValidationError } from "@/services/auth";
import { LoginScreenNavigationProp } from "@navigation";
import auth from "@react-native-firebase/auth";
import { SCREENS } from "@shared-constants";
import { styles } from "./ForgotPasswordScreen.style";

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      showValidationError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showValidationError("Please enter a valid email address.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    setLoading(true);
    try {
      await auth().sendPasswordResetEmail(normalizedEmail);

      navigation.navigate(SCREENS.PASSWORD_RESET_EMAIL_SENT);
    } catch (error: any) {
      console.log("Error:", error.code, error.message);

      if (error.code === "auth/user-not-found") {
        Alert.alert(
          "Account Not Found",
          "No account exists with this email. Want to sign up?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Sign Up",
              onPress: () => navigation.navigate(SCREENS.SIGNUP),
            },
          ],
        );
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Invalid Email", "Please enter a valid email address.");
      } else {
        Alert.alert("Error", "Failed to send reset email. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleSignIn = () => {
    navigation.goBack();
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
              Forgot password?
            </Text>
            <Text
              style={styles.description}
              className="text-center text-typography-500"
            >
              Don&apos;t worry! It happens. Please enter the email associated
              with your account.
            </Text>
          </VStack>
        </View>

        <FormControl style={styles.formControl}>
          <VStack space="xs">
            <FormControlLabel>
              <FormControlLabelText className="text-typography-900">
                Email
              </FormControlLabelText>
            </FormControlLabel>
            <Input style={styles.input}>
              <InputField
                type="text"
                placeholder="example@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.inputField}
              />
            </Input>
          </VStack>
        </FormControl>

        <Button
          size="xl"
          onPress={handleSendCode}
          style={styles.sendCodeButton}
          isDisabled={loading}
        >
          <ButtonText>{loading ? "Sending..." : "Send code"}</ButtonText>
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

export default ForgotPasswordScreen;
