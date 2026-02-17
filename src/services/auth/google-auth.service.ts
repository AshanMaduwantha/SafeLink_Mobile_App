import { Alert } from "react-native";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "@react-native-firebase/auth";
import { serverTimestamp } from "@react-native-firebase/firestore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  createUserProfile,
  generateUniqueMemberId,
  getUserProfile,
  updateUserProfile,
} from "../user/user.service";

export interface GoogleSignInResult {
  success: boolean;
  error?: string;
  isNewUser?: boolean;
}

export const initializeGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId:
      "812589116900-s2ibudve24f2mft77udps0392k9gttq5.apps.googleusercontent.com", //public ID
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });
};

export const handleGoogleSignIn = async (): Promise<GoogleSignInResult> => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // Get the user's ID token
    const signInResult = await GoogleSignin.signIn();

    // Get the ID token from the sign in result
    const idToken = signInResult.data?.idToken;

    if (!idToken) {
      throw new Error("No ID token found");
    }

    // Create a Google credential with the token and sign in the user
    const googleCredential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(
      getAuth(),
      googleCredential,
    );

    const { user } = userCredential;
    const email = user.email || signInResult?.data?.user?.email || "";
    const displayName =
      user.displayName || signInResult?.data?.user?.name || "";

    if (!email) {
      throw new Error(
        "We could not retrieve your email from Google. Please try again or use another sign in option.",
      );
    }

    let isNewUser = false;

    // Wait for auth token to propagate to Firestore
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if user profile exists in Firestore
    const existingProfile = await getUserProfile(user.uid);

    if (!existingProfile) {
      // Create a basic user profile with data from Google
      isNewUser = true;

      try {
        await createUserProfile(user.uid, {
          email,
          name: displayName || email.split("@")[0],
          title: "",
          phone: "",
          provider: "google",
        });
        console.log("Created user profile for Google sign-in user");
      } catch (firestoreError: any) {
        console.error("Firestore profile creation failed:", firestoreError);

        // Rollback the user creation
        console.log("Rolling back: Deleting user from Firebase Auth");
        await user.delete();

        throw new Error(
          "Failed to create user profile. Please try again. If the problem persists, contact support.",
        );
      }

      // Wait a bit more to ensure everything is ready for FCM token save
      await new Promise((resolve) => setTimeout(resolve, 500));
    } else {
      const updates: Record<string, any> = {};

      if (!existingProfile.provider) {
        updates.provider = "google";
      }

      if (!existingProfile.email) {
        updates.email = email;
      }

      if (!existingProfile.name && (displayName || email)) {
        updates.name = displayName || email.split("@")[0];
      }

      if (!existingProfile.memberId) {
        updates.memberId = await generateUniqueMemberId();
      }

      if (!existingProfile.createdAt) {
        updates.createdAt = serverTimestamp();
      }

      if (Object.keys(updates).length) {
        await updateUserProfile(user.uid, updates);
        console.log("Updated Google user profile with missing fields");
      }
    }

    console.log("User signed in with Google!");
    return { success: true, isNewUser };
  } catch (error: any) {
    let errorMessage = "an error occurred during google sign in";

    if (error.message?.includes("Failed to create user profile")) {
      errorMessage = error.message;
    } else if (error.code === "statusCodes.SIGN_IN_CANCELLED") {
      errorMessage = "google sign in was cancelled";
    } else if (error.code === "statusCodes.IN_PROGRESS") {
      errorMessage = "google sign in is already in progress";
    } else if (error.code === "statusCodes.PLAY_SERVICES_NOT_AVAILABLE") {
      errorMessage = "google play services not available or outdated";
    } else if (error.code === "auth/account-exists-with-different-credential") {
      errorMessage =
        "an account already exists with the same email address but different sign-in credentials";
    }

    console.error("Google sign in error:", error);
    return { success: false, error: errorMessage };
  }
};

export const showGoogleSignInError = (errorMessage: string) => {
  Alert.alert("Google Sign In Failed", errorMessage);
};
