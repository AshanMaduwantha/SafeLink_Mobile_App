import { Alert } from "react-native";
import {
  appleAuth,
  AppleRequestResponse,
} from "@invertase/react-native-apple-authentication";
import {
  AppleAuthProvider,
  getAuth,
  signInWithCredential,
} from "@react-native-firebase/auth";
import {
  createUserProfile,
  generateUniqueMemberId,
  getUserProfile,
  updateUserProfile,
} from "../user/user.service";

export interface AppleSignInResult {
  success: boolean;
  error?: string;
  isNewUser?: boolean;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const formatFullName = (
  fullName?: AppleRequestResponse["fullName"],
): string => {
  if (!fullName) {
    return "";
  }

  const parts = [fullName.givenName, fullName.familyName].filter(Boolean);
  return parts.join(" ").trim();
};

export const handleAppleSignIn = async (): Promise<AppleSignInResult> => {
  if (!appleAuth.isSupported) {
    return {
      success: false,
      error: "apple sign in is not supported on this device",
    };
  }

  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    if (!appleAuthRequestResponse.identityToken) {
      throw new Error("apple sign in failed - no identity token returned");
    }

    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = AppleAuthProvider.credential(identityToken, nonce);
    const userCredential = await signInWithCredential(
      getAuth(),
      appleCredential,
    );
    const { user } = userCredential;

    const email = user.email ?? appleAuthRequestResponse.email ?? "";
    if (!email) {
      throw new Error(
        "We could not retrieve your email from Apple. Please try again or use another sign in option.",
      );
    }

    const derivedName =
      formatFullName(appleAuthRequestResponse.fullName) ||
      user.displayName ||
      appleAuthRequestResponse.fullName?.nickname ||
      email.split("@")[0];

    let isNewUser = false;

    await wait(1000);

    const existingProfile = await getUserProfile(user.uid);

    if (!existingProfile) {
      isNewUser = true;

      try {
        await createUserProfile(user.uid, {
          email,
          name: derivedName,
          title: "",
          phone: "",
          provider: "apple",
        });
        console.log("Created user profile for Apple sign-in user");
      } catch (firestoreError: any) {
        console.error("Firestore profile creation failed:", firestoreError);
        await user.delete();
        throw new Error(
          "Failed to create user profile. Please try again. If the problem persists, contact support.",
        );
      }

      await wait(500);
    } else {
      const updates: Record<string, any> = {};

      if (!existingProfile.provider) {
        updates.provider = "apple";
      }

      if (!existingProfile.name && derivedName) {
        updates.name = derivedName;
      }

      if (!existingProfile.email && email) {
        updates.email = email;
      }

      if (!existingProfile.memberId) {
        updates.memberId = await generateUniqueMemberId();
      }

      if (Object.keys(updates).length) {
        await updateUserProfile(user.uid, updates);
      }
    }

    console.log("User signed in with Apple!");
    return { success: true, isNewUser };
  } catch (error: any) {
    let errorMessage = "an error occurred during apple sign in";

    if (error.message?.includes("Failed to create user profile")) {
      errorMessage = error.message;
    } else if (error.code === appleAuth.Error.CANCELED) {
      errorMessage = "apple sign in was cancelled";
    } else if (error.code === appleAuth.Error.FAILED) {
      errorMessage = "apple sign in failed";
    } else if (error.code === appleAuth.Error.INVALID_RESPONSE) {
      errorMessage = "apple sign in returned an invalid response";
    } else if (error.code === appleAuth.Error.NOT_HANDLED) {
      errorMessage = "apple sign in was not handled";
    } else if (error.code === appleAuth.Error.UNKNOWN) {
      errorMessage = "an unknown error occurred during apple sign in";
    }

    console.error("Apple sign in error:", error);
    return { success: false, error: errorMessage };
  }
};

export const showAppleSignInError = (errorMessage: string) => {
  Alert.alert("Apple Sign In Failed", errorMessage);
};

//use when deleting user from firebase. This will revoke the apple sign in token.
export const revokeAppleSignInToken = async (): Promise<void> => {
  const { authorizationCode } = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.REFRESH,
  });

  if (!authorizationCode) {
    throw new Error(
      "Apple revocation failed - no authorization code returned. Please try again.",
    );
  }

  await getAuth().revokeToken(authorizationCode);
};
