import React, { useEffect, useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { LoginScreenNavigationProp } from "@navigation";
import { SCREENS } from "@shared-constants";
import { styles } from "./ForgotPasswordCodeScreen.style";

const ForgotPasswordCodeScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [code, setCode] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(20); // 20 seconds timer
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  // Timer countdown effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleCodeChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const fullCode = code.join("");
    if (fullCode.length === 4) {
      console.log("Verifying code:", fullCode);
      // Handle verification logic here
      navigation.navigate(SCREENS.RESET_PASSWORD);
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      console.log("Resending code...");
      setTimer(20);
      setCanResend(false);
      setCode(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
              Please check your email
            </Text>
            <Text
              style={styles.subtitle}
              className="text-center text-typography-500"
            >
              We&apos;ve sent a code to helloworld@gmail.com
            </Text>
          </VStack>
        </View>

        <View style={styles.codeInputSection}>
          <HStack space="md" className="justify-center">
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                style={[
                  styles.codeInput,
                  digit ? styles.codeInputFilled : styles.codeInputEmpty,
                ]}
                value={digit}
                onChangeText={(value) => handleCodeChange(value, index)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent.key, index)
                }
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
                selectTextOnFocus
              />
            ))}
          </HStack>
        </View>

        <Button
          size="xl"
          onPress={handleVerify}
          style={[
            styles.verifyButton,
            code.join("").length === 4
              ? styles.verifyButtonActive
              : styles.verifyButtonInactive,
          ]}
        >
          <ButtonText>Verify</ButtonText>
        </Button>

        <View style={styles.resendSection}>
          <TouchableOpacity
            onPress={handleResendCode}
            disabled={!canResend}
            style={styles.resendButton}
          >
            <Text
              style={[
                styles.resendText,
                canResend ? styles.resendTextActive : styles.resendTextInactive,
              ]}
            >
              Send code again {formatTime(timer)}
            </Text>
          </TouchableOpacity>
        </View>
      </VStack>
    </View>
  );
};

export default ForgotPasswordCodeScreen;
