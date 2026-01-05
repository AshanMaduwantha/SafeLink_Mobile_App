import {
  doc,
  FirebaseFirestoreTypes,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "@react-native-firebase/firestore";
import "react-native-get-random-values";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  title: string;
  phone: string;
  memberId?: string;
  address?: string;
  photoURL?: string;
  provider?: "google" | "email/password" | "apple";
  createdAt:
    | FirebaseFirestoreTypes.Timestamp
    | FirebaseFirestoreTypes.FieldValue;
  updatedAt:
    | FirebaseFirestoreTypes.Timestamp
    | FirebaseFirestoreTypes.FieldValue;
}

export interface UserClassPack {
  totalCredits: number;
  creditsRemaining: number;
  purchasedAt?:
    | FirebaseFirestoreTypes.Timestamp
    | FirebaseFirestoreTypes.FieldValue;
  updatedAt:
    | FirebaseFirestoreTypes.Timestamp
    | FirebaseFirestoreTypes.FieldValue;
}

/**
 * Removes undefined values from an object
 */
const removeUndefinedFields = <T extends Record<string, any>>(
  obj: T,
): Partial<T> =>
  Object.fromEntries(
    // eslint-disable-next-line unused-imports/no-unused-vars
    Object.entries(obj).filter(([_, v]) => v !== undefined),
  ) as Partial<T>;

/**
 * Creates a new user profile in Firestore
 * Used during initial sign-up when the user doesn't exist
 */
export const createUserProfile = async (
  uid: string,
  userData: {
    email: string;
    name: string;
    title: string;
    phone: string;
    provider?: "google" | "email/password" | "apple";
  },
): Promise<void> => {
  try {
    // Ensure a unique memberId is generated for the user
    const uniqueMemberId = await generateUniqueMemberId();

    const userProfile = {
      uid,
      email: userData.email,
      name: userData.name,
      title: userData.title,
      phone: userData.phone,
      memberId: uniqueMemberId,
      provider: userData.provider,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const db = getFirestore();
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, userProfile);

    console.log("User profile created successfully");
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

//Retrieves a user profile from Firestore
export const getUserProfile = async (
  uid: string,
): Promise<UserProfile | null> => {
  try {
    const db = getFirestore();
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      return snapshot.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

/**
 * Updates an existing user profile in Firestore
 * Used when the profile exists and want to update specific fields
 */

export const updateUserProfile = async (
  uid: string,
  updates: Partial<Omit<UserProfile, "uid">>,
): Promise<void> => {
  try {
    const db = getFirestore();
    const userRef = doc(db, "users", uid);

    // Remove undefined values before updating
    const cleanedUpdates = removeUndefinedFields(updates);

    await updateDoc(userRef, {
      ...cleanedUpdates,
      updatedAt: serverTimestamp(),
    });

    console.log("User profile updated successfully");
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

/**
 * Creates or updates a user profile in Firestore
 * Use if the profile doesn't exists
 */
export const upsertUserProfile = async (
  uid: string,
  userData: {
    email: string;
    name: string;
    title?: string;
    phone?: string;
    address?: string;
    photoURL?: string;
    provider?: "google" | "email/password" | "apple";
  },
): Promise<void> => {
  try {
    const db = getFirestore();
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      // Update existing profile - remove undefined values
      const cleanedData = removeUndefinedFields(userData);
      await updateDoc(userRef, {
        ...cleanedData,
        updatedAt: serverTimestamp(),
      });
      console.log("User profile updated successfully");
    } else {
      // Create new profile
      const uniqueMemberId = await generateUniqueMemberId();
      const userProfile = removeUndefinedFields({
        uid,
        email: userData.email,
        name: userData.name,
        title: userData.title || "",
        phone: userData.phone || "",
        address: userData.address || "",
        memberId: uniqueMemberId,
        photoURL: userData.photoURL,
        provider: userData.provider,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await setDoc(userRef, userProfile);
      console.log("User profile created successfully");
    }
  } catch (error) {
    console.error("Error upserting user profile:", error);
    throw error;
  }
};

export const getUserClassPackById = async (
  uid: string,
  packId: string,
): Promise<UserClassPack | null> => {
  try {
    const db = getFirestore();
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) return null;
    const data = snapshot.data() as any;
    const entry = data?.classPacks?.[packId];
    if (
      entry &&
      typeof entry.creditsRemaining === "number" &&
      typeof entry.totalCredits === "number"
    ) {
      return {
        totalCredits: entry.totalCredits,
        creditsRemaining: entry.creditsRemaining,
        purchasedAt: entry.purchasedAt,
        updatedAt: entry.updatedAt,
      } as UserClassPack;
    }
    return null;
  } catch (error) {
    console.error("Error getting user class pack by id:", error);
    throw error;
  }
};

/**
 * Generates a unique memberId
 * Uses cryptographically random values with high entropy to avoid collisions
 */
export const generateUniqueMemberId = (): Promise<string> => {
  const code = generateRandomCode(8);
  return Promise.resolve(`dancey-${code}`);
};

const ALPHANUM = "abcdefghijklmnopqrstuvwxyz0123456789";
const generateRandomCode = (length: number): string => {
  const cryptoObj = (globalThis as any).crypto;
  const bytes = new Uint8Array(length);
  cryptoObj.getRandomValues(bytes);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += ALPHANUM[bytes[i] % ALPHANUM.length];
  }
  return result;
};
