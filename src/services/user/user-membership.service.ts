import {
  doc,
  FirebaseFirestoreTypes,
  getDoc,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from "@react-native-firebase/firestore";

export interface UpdateUserMembershipInput {
  uid: string;
  membershipId: string;
  membershipName: string;
}

export interface CurrentMembership {
  membership_id: string;
  name: string;
  startedAt?: FirebaseFirestoreTypes.FieldValue;
}

/**
 * Create membership document under users collection.
 */
export const updateUserMembership = async (
  input: UpdateUserMembershipInput,
): Promise<void> => {
  const db = getFirestore();
  const userRef = doc(db, "users", input.uid);
  const existing = await getDoc(userRef);
  if (!existing.exists()) {
    throw new Error("User profile not found. Please complete your profile.");
  }

  // Prevent overriding an existing membership
  const data = existing.data() as any;
  if (data?.currentMembership?.membership_id) {
    throw new Error(
      "You already have an active membership. Change your membership in the next billing cycle to access this class.",
    );
  }

  await updateDoc(userRef, {
    currentMembership: {
      membership_id: input.membershipId,
      name: input.membershipName,
      startedAt: serverTimestamp(),
    },
    updatedAt: serverTimestamp(),
  });
};

/**
 * Remove currentMembership from user document (used to rollback on failure).
 */
export const clearUserMembership = async (
  uid: string,
  expectedMembershipId?: string,
): Promise<void> => {
  const db = getFirestore();
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) return;

  const data = snapshot.data() as any;
  const current = data?.currentMembership;
  if (
    expectedMembershipId &&
    current?.membership_id &&
    current.membership_id !== expectedMembershipId
  ) {
    // Membership changed since we saved; don't clear
    return;
  }

  await updateDoc(userRef, {
    currentMembership: null,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Reads the user's current membership data from Firestore
 */
export const getUserCurrentMembership = async (
  uid: string,
): Promise<CurrentMembership | null> => {
  const db = getFirestore();
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) return null;

  const data = snapshot.data() as any;
  const current = data?.currentMembership;
  if (current && typeof current === "object" && current.membership_id) {
    return {
      membership_id: String(current.membership_id),
      name: String(current.name ?? ""),
      startedAt: current.startedAt,
    };
  }
  return null;
};

export const hasActiveMembership = async (uid: string): Promise<boolean> => {
  const current = await getUserCurrentMembership(uid);
  return Boolean(current?.membership_id);
};
