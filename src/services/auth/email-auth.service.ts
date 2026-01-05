import { Alert } from "react-native";
import { loginSchema, signUpSchema } from "@/shared/validations";
import {
  createUserWithEmailAndPassword,
  getAuth,
  getIdTokenResult,
  signInWithEmailAndPassword,
  updateProfile,
} from "@react-native-firebase/auth";
import { createUserProfile } from "../user/user.service";

export interface EmailSignInResult {
  success: boolean;
  error?: string;
  role?: string;
}

export interface EmailSignUpResult {
  success: boolean;
  error?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  title: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  agreeTerms: boolean;
}

const getSignInErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "invalid email or password. please check your credentials and try again.";
    case "auth/invalid-email":
      return "please enter a valid email address";
    case "auth/user-disabled":
      return "this account has been disabled. please contact support.";
    case "auth/too-many-requests":
      return "too many failed login attempts. please try again later or reset your password.";
    case "auth/network-request-failed":
      return "network error. please check your internet connection.";
    default:
      return "an error occurred during sign in";
  }
};

const getSignUpErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "this email address is already registered. please sign in instead.";
    case "auth/invalid-email":
      return "please enter a valid email address";
    case "auth/weak-password":
      return "password is too weak. please use a stronger password with at least 6 characters.";
    case "auth/operation-not-allowed":
      return "email/password accounts are not enabled. please contact support.";
    case "auth/network-request-failed":
      return "network error. please check your internet connection.";
    default:
      return "an error occurred during sign up";
  }
};

export const handleEmailSignIn = async (
  credentials: SignInCredentials,
): Promise<EmailSignInResult> => {
  try {
    // Validate input using Zod
    const validationResult = loginSchema.safeParse(credentials);

    if (!validationResult.success) {
      const [firstError] = validationResult.error.issues;
      return { success: false, error: firstError.message };
    }

    const auth = getAuth();
    await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password,
    );

    console.log("[Firebase Auth] User signed in!");

    // Fetch user role from custom claims
    const user = auth.currentUser;
    let role: string | undefined;
    if (user) {
      const tokenResult = await getIdTokenResult(user, true);
      role = (tokenResult.claims.role as string) || "app user";
      console.log("[Firebase Auth] role:", role);
    }

    return { success: true, role };
  } catch (error: any) {
    const errorMessage = getSignInErrorMessage(error.code);
    console.error("Login error:", error.code, error.message);
    return { success: false, error: errorMessage };
  }
};

export const handleEmailSignUp = async (
  credentials: SignUpCredentials,
): Promise<EmailSignUpResult> => {
  let userCredential: any = null;

  try {
    // Validate input using Zod
    const validationResult = signUpSchema.safeParse(credentials);

    if (!validationResult.success) {
      const [firstError] = validationResult.error.issues;
      return { success: false, error: firstError.message };
    }

    const auth = getAuth();
    userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password,
    );

    // Update the user profile with display name
    await updateProfile(userCredential.user, {
      displayName: credentials.name,
    });

    // Wait for auth token to propagate to Firestore
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Store user data on Firestore collection
    try {
      await createUserProfile(userCredential.user.uid, {
        email: credentials.email,
        name: credentials.name,
        title: credentials.title,
        phone: credentials.phone,
        provider: "email/password",
      });
    } catch (firestoreError: any) {
      console.error("Firestore profile creation failed:", firestoreError);

      // Rollback the user creation
      console.log("Rolling back: Deleting user from Firebase Auth");
      await userCredential.user.delete();

      throw new Error(
        "Failed to create user profile. Please try again. If the problem persists, contact support.",
      );
    }

    // Wait a bit more to ensure everything is ready for FCM token save
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("User account created & signed in!");
    return { success: true };
  } catch (error: any) {
    if (
      userCredential &&
      error.message?.includes("Failed to create user profile")
    ) {
      return { success: false, error: error.message };
    }

    const errorMessage = getSignUpErrorMessage(error.code);
    console.error("Sign up error:", error.code, error.message);
    return { success: false, error: errorMessage };
  }
};

export const showSignInError = (errorMessage: string) => {
  Alert.alert("Sign In Failed", errorMessage);
};

export const showSignUpError = (errorMessage: string) => {
  Alert.alert("Sign Up Failed", errorMessage);
};

export const showValidationError = (errorMessage: string) => {
  Alert.alert("Validation Error", errorMessage);
};
