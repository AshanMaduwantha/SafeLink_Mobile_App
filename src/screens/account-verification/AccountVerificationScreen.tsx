import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { RootStackParamList } from "@/navigation";
import { getAuth, getIdTokenResult } from "@react-native-firebase/auth";
import { SCREENS } from "@shared-constants";
import { styles } from "./AccountVerificationScreen.style";

const AccountVerificationScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          // No user found, go to onboarding
          navigation.replace(SCREENS.ONBOARDING);
          return;
        }

        // Fetch custom claims to get user role
        const tokenResult = await getIdTokenResult(user, true);
        const role = (tokenResult.claims.role as string) || "app user";

        console.log("[Firebase Auth] User role:", role);

        // Navigate based on role
        if (role === "instructor") {
          navigation.replace(SCREENS.INSTRUCTOR_HOME);
        } else {
          navigation.replace(SCREENS.ROOT);
        }
      } catch (err: any) {
        console.error("Account verification error:", err);
        setError("Failed to verify account. Please try again.");
        // On error, default to ROOT screen
        setTimeout(() => {
          navigation.replace(SCREENS.ROOT);
        }, 2000);
      }
    };

    // Small delay to ensure smooth transition
    setTimeout(verifyAccount, 500);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.verifyingText}>
          {error ? "Verification failed..." : "Verifying your account..."}
        </Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </SafeAreaView>
  );
};

export default AccountVerificationScreen;
