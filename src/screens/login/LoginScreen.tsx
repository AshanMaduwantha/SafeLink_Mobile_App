import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import GoogleLogo from "@/components/ui/google-logo";
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
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeGoogleSignIn();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    const result = await handleEmailSignIn({ email, password });

    if (result.success) {
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.subtitle}>
            Hi Welcome back, you&apos;ve been missed
          </Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="example@gmail.com"
              placeholderTextColor="#B0B0B0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.textInput, styles.passwordInput]}
              placeholder="••••••••••••"
              placeholderTextColor="#B0B0B0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <Icon
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={22}
                color="#999"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.rememberForgotRow}>
          <TouchableOpacity
            style={styles.rememberMeRow}
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.7}
          >
            <View
              style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
            >
              {rememberMe && <Icon name="checkmark" size={12} color="#fff" />}
            </View>
            <Text style={styles.rememberText}>Remember me</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate(SCREENS.FORGOT_PASSWORD)}
          >
            <Text style={styles.forgotPasswordText}>Forgot password ?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          style={styles.signInButton}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <View style={styles.signInButtonRow}>
              <ActivityIndicator
                size="small"
                color="#fff"
                style={styles.spinnerMargin}
              />
              <Text style={styles.signInButtonText}>Signing in...</Text>
            </View>
          ) : (
            <Text style={styles.signInButtonText}>Sign up</Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Connect with</Text>
          <View style={styles.divider} />
        </View>

        {Platform.OS === "ios" && (
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleAppleLogin}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Icon name="logo-apple" size={22} color="#000" />
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleGoogleLogin}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <GoogleLogo size={22} />
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={styles.footerSection}>
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(SCREENS.SIGNUP)}
              disabled={isLoading}
            >
              <Text style={styles.signUpLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
