import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import GoogleLogo from "@/components/ui/google-logo";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import {
  handleAppleSignIn,
  handleEmailSignIn,
  handleGoogleSignIn,
  initializeGoogleSignIn,
  showAppleSignInError,
  showGoogleSignInError,
  showSignInError,
  showValidationError,
} from "@/services/auth";
import { LoginScreenNavigationProp } from "@navigation";
import { SCREENS } from "@shared-constants";
import { styles } from "./LoginScreen.style";

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeGoogleSignIn();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);

    const result = await handleEmailSignIn({ email, password });

    if (result.success) {
      // Navigate to main app
      navigation.replace(SCREENS.ROOT);
    } else {
      if (
        result.error?.includes("Validation Error") ||
        result.error?.includes("email") ||
        result.error?.includes("password")
      ) {
        showValidationError(result.error);
      } else {
        showSignInError(result.error || "An error occurred during sign in");
      }
    }

    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    const result = await handleGoogleSignIn();

    if (result.success) {
      navigation.replace(SCREENS.ROOT);
    } else {
      showGoogleSignInError(
        result.error || "An error occurred during Google sign in",
      );
    }
  };

  const handleAppleLogin = async () => {
    const result = await handleAppleSignIn();

    if (result.success) {
      navigation.replace(SCREENS.ROOT);
    } else {
      showAppleSignInError(
        result.error || "An error occurred during Apple sign in",
      );
    }
  };

  return (
    <View
      className="flex-1 justify-center items-center bg-background-0"
      style={styles.container}
    >
      <VStack space="xl" className="w-full max-w-sm mb-55">
        <View style={styles.titleSection}>
          <VStack space="sm" className="items-center">
            <Text
              style={styles.title}
              className="text-center text-normal font-bold"
            >
              Sign in
            </Text>
            <Text
              style={styles.subtitle}
              className="text-center text-typography-500"
            >
              Hi Welcome back, you&apos;ve been missed
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
                autoCapitalize="none"
                style={styles.inputField}
              />
            </Input>
          </VStack>
        </FormControl>

        <FormControl style={styles.formControl}>
          <VStack space="xs">
            <FormControlLabel>
              <FormControlLabelText className="text-typography-900">
                Password
              </FormControlLabelText>
            </FormControlLabel>
            <View style={styles.passwordInputContainer}>
              <Input style={styles.input}>
                <InputField
                  type="text"
                  placeholder={"••••••••"}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={[styles.inputField, styles.passwordPlaceholder]}
                />
              </Input>
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
              >
                <Icon
                  name={showPassword ? "eye" : "eye-slash"}
                  size={24}
                  color="#888"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate(SCREENS.FORGOT_PASSWORD)}
              style={styles.forgotPasswordLink}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </VStack>
        </FormControl>

        <Button
          size="xl"
          onPress={handleLogin}
          style={styles.signUpButton}
          disabled={isLoading}
        >
          <HStack space="sm" className="items-center justify-center">
            {isLoading && (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
                style={styles.spinnerMargin}
              />
            )}
            <ButtonText>{isLoading ? "Signing in..." : "Sign in"}</ButtonText>
          </HStack>
        </Button>

        <View style={styles.socialSection}>
          <HStack space="md" className="items-center">
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Connect with</Text>
            <View style={styles.divider} />
          </HStack>

          <VStack space="sm" className="mt-8">
            {Platform.OS === "ios" && (
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleAppleLogin}
                disabled={isLoading}
              >
                <HStack space="sm" className="items-center justify-center">
                  <Icon name="apple" size={24} color="#000000" />
                  <Text style={styles.socialButtonText}>
                    Continue with Apple
                  </Text>
                </HStack>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleGoogleLogin}
              disabled={isLoading}
            >
              <HStack space="sm" className="items-center justify-center">
                <GoogleLogo size={24} />
                <Text style={styles.socialButtonText}>
                  Continue with Google
                </Text>
              </HStack>
            </TouchableOpacity>
          </VStack>
        </View>

        <View style={styles.footerSection}>
          <HStack space="xs" className="justify-center items-center">
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(SCREENS.SIGNUP)}
              disabled={isLoading}
            >
              <Text style={styles.signUpLink}>Sign up</Text>
            </TouchableOpacity>
          </HStack>
        </View>
      </VStack>
    </View>
  );
};

export default LoginScreen;
