import {
  doc,
  FirebaseFirestoreTypes,
  getDoc,
  getFirestore,
} from "@react-native-firebase/firestore";

export interface ClassPack {
  pack_id: string;
  pack_name: string;
  creditsRemaining: number;
  purchasedAt?: FirebaseFirestoreTypes.FieldValue;
}

export interface PurchasedClassPack extends ClassPack {
  classPackId: string;
}

/**
 * Reads the user's purchased class packs data from Firestore
 */
export const getUserClassPacks = async (
  uid: string,
): Promise<PurchasedClassPack[]> => {
  const db = getFirestore();
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) return [];

  const data = snapshot.data() as any;
  const classPacksObject = data?.classPacks;

  if (classPacksObject && typeof classPacksObject === "object") {
    const purchasedClassPacks: PurchasedClassPack[] = Object.keys(
      classPacksObject,
    ).map((classPackId) => {
      const classPack = classPacksObject[classPackId];
      return {
        classPackId: classPackId,
        pack_id: String(classPack.pack_id),
        pack_name: String(classPack.pack_name ?? ""),
        creditsRemaining: classPack.creditsRemaining,
        purchasedAt: classPack.purchasedAt,
      };
    });
    return purchasedClassPacks;
  }
  return [];
};

export const hasActiveMembership = async (uid: string): Promise<boolean> => {
  const classPacks = await getUserClassPacks(uid);
  return classPacks.length > 0;
};
