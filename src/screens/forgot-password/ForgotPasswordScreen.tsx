import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import { showValidationError } from "@/services/auth";
import { LoginScreenNavigationProp } from "@navigation";
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

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>Forgot password?</Text>
        <Text style={styles.description}>
          Don&apos;t worry! It happens. Please enter the email associated with
          your account.
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

      <TouchableOpacity
        onPress={handleSendCode}
        style={styles.sendCodeButton}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.sendCodeButtonText}>Send code</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footerSection}>
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Remember password? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.signInLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;
