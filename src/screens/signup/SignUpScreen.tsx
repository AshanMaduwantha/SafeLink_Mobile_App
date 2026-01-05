import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
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
  handleEmailSignUp,
  handleGoogleSignIn,
  initializeGoogleSignIn,
  showAppleSignInError,
  showGoogleSignInError,
  showSignUpError,
  showValidationError,
} from "@/services/auth";
import { LoginScreenNavigationProp } from "@navigation";
import { SCREENS } from "@shared-constants";
import { styles } from "./SignUpScreen.style";

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTitleDropdown, setShowTitleDropdown] = useState(false);

  const titleOptions = [
    { label: "Mr", value: "Mr" },
    { label: "Mrs", value: "Mrs" },
    { label: "Miss", value: "Miss" },
    { label: "Dr", value: "Dr" },
    { label: "Prof", value: "Prof" },
    { label: "Sir", value: "Sir" },
    { label: "Madam", value: "Madam" },
  ];

  useEffect(() => {
    initializeGoogleSignIn();
  }, []);

  const handleSignUp = async () => {
    setIsLoading(true);

    const result = await handleEmailSignUp({
      title,
      name,
      phone,
      email,
      password,
      agreeTerms,
    });

    if (result.success) {
      navigation.replace(SCREENS.ROOT);
    } else {
      if (
        result.error?.includes("Validation Error") ||
        result.error?.includes("email") ||
        result.error?.includes("password") ||
        result.error?.includes("name") ||
        result.error?.includes("terms")
      ) {
        showValidationError(result.error);
      } else {
        showSignUpError(result.error || "An error occurred during sign up");
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

  const handleSignIn = () => {
    navigation.goBack();
  };

  return (
    <View
      className="flex-1 justify-center items-center bg-background-0"
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <VStack space="xl" className="w-full mb-55">
          <View style={styles.titleSection}>
            <VStack space="sm" className="items-center">
              <Text
                style={styles.title}
                className="text-center text-normal font-bold"
              >
                Sign up
              </Text>
              <Text
                style={styles.subtitle}
                className="text-center text-typography-500"
              >
                Create your account to get started
              </Text>
            </VStack>
          </View>

          <FormControl style={styles.formControl}>
            <VStack space="xs">
              <FormControlLabel>
                <FormControlLabelText className="text-typography-900">
                  Title
                </FormControlLabelText>
              </FormControlLabel>
              <TouchableOpacity
                style={[styles.input, styles.selectTrigger]}
                onPress={() => setShowTitleDropdown(!showTitleDropdown)}
              >
                <Text
                  style={[
                    styles.selectText,
                    title ? styles.selectedText : styles.placeholderText,
                  ]}
                >
                  {title || "Select Title"}
                </Text>
                <Icon
                  name="chevron-down"
                  size={16}
                  color="#888"
                  style={styles.chevronIcon}
                />
              </TouchableOpacity>

              <Modal
                visible={showTitleDropdown}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowTitleDropdown(false)}
              >
                <TouchableOpacity
                  style={styles.modalOverlay}
                  activeOpacity={1}
                  onPress={() => setShowTitleDropdown(false)}
                >
                  <View style={styles.dropdownContainer}>
                    {titleOptions.map((option, index) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.dropdownItem,
                          index === titleOptions.length - 1 &&
                            styles.dropdownItemLast,
                        ]}
                        onPress={() => {
                          setTitle(option.value);
                          setShowTitleDropdown(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            title === option.value &&
                              styles.dropdownItemSelected,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </TouchableOpacity>
              </Modal>
            </VStack>
          </FormControl>

          <FormControl style={styles.formControl}>
            <VStack space="xs">
              <FormControlLabel>
                <FormControlLabelText className="text-typography-900">
                  Name
                </FormControlLabelText>
              </FormControlLabel>
              <Input style={styles.input}>
                <InputField
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChangeText={setName}
                  style={styles.inputField}
                  autoCapitalize="none"
                />
              </Input>
            </VStack>
          </FormControl>

          <FormControl style={styles.formControl}>
            <VStack space="xs">
              <FormControlLabel>
                <FormControlLabelText className="text-typography-900">
                  Phone Number
                </FormControlLabelText>
              </FormControlLabel>
              <Input style={styles.input}>
                <InputField
                  type="text"
                  placeholder="0412 345 678"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  style={styles.inputField}
                />
              </Input>
            </VStack>
          </FormControl>

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
                  autoCapitalize="none"
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
                    placeholder={"•••••••••••••"}
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
            </VStack>
          </FormControl>

          <View style={styles.termsSection}>
            <HStack space="sm" className="items-center">
              <TouchableOpacity
                onPress={() => setAgreeTerms(!agreeTerms)}
                style={styles.checkbox}
              >
                {agreeTerms && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              <Text style={styles.termsText}>Agree with </Text>
              <TouchableOpacity>
                <Text style={styles.termsLink}>Terms & Condition</Text>
              </TouchableOpacity>
            </HStack>
          </View>

          <Button
            size="xl"
            onPress={handleSignUp}
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
              <ButtonText>{isLoading ? "Signing up..." : "Sign up"}</ButtonText>
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
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleSignIn} disabled={isLoading}>
                <Text style={styles.signInLink}>Sign in</Text>
              </TouchableOpacity>
            </HStack>
          </View>
        </VStack>
      </ScrollView>
    </View>
  );
};

export default SignUpScreen;
