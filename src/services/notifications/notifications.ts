import { PermissionsAndroid, Platform } from "react-native";
import { getAuth, getIdTokenResult } from "@react-native-firebase/auth";
import {
  deleteField,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "@react-native-firebase/firestore";
import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  onTokenRefresh,
  requestPermission,
} from "@react-native-firebase/messaging";

export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Request notification permissions
   * iOS: Shows permission dialog
   * Android 13+: Requests POST_NOTIFICATIONS permission
   */
  async requestPermission(): Promise<boolean> {
    try {
      if (Platform.OS === "ios") {
        const messaging = getMessaging();
        const authStatus = await requestPermission(messaging);
        const enabled =
          authStatus === AuthorizationStatus.AUTHORIZED ||
          authStatus === AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log(
            "[Notification Service] iOS notification permission granted:",
            authStatus,
          );
        }
        return enabled;
      } else {
        // Android 13+ requires runtime permission
        const version =
          typeof Platform.Version === "number"
            ? Platform.Version
            : parseInt(String(Platform.Version), 10);
        if (version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        // Android 12 and below don't require permission
        return true;
      }
    } catch (error) {
      console.error(
        "[Notification Service] Error requesting notification permission:",
        error,
      );
      return false;
    }
  }

  /**
   * Get FCM token for this device
   */
  async getToken(): Promise<string | null> {
    try {
      const messaging = getMessaging();
      const token = await getToken(messaging);
      //console.log("FCM Token:", token);
      return token;
    } catch (error) {
      console.error("[Notification Service] Error getting FCM token:", error);
      return null;
    }
  }

  /**
   * Save FCM token to Firestore for the current user
   */
  async saveFCMToken(): Promise<void> {
    try {
      const { currentUser } = getAuth();
      if (!currentUser) {
        console.log(
          "[Notification Service] No user logged in, skipping FCM token save",
        );
        return;
      }

      // Get user role from custom claims
      let role = "app user";
      try {
        const tokenResult = await getIdTokenResult(currentUser, true);
        role = (tokenResult.claims.role as string) || "app user";
      } catch (error) {
        console.error(
          "[Notification Service] Error checking user role:",
          error,
        );
      }

      const token = await this.getToken();
      if (!token) {
        console.log("[Notification Service] No FCM token available...");
        return;
      }

      const firestore = getFirestore();
      const userDocRef = doc(firestore, "users", currentUser.uid);

      await setDoc(
        userDocRef,
        {
          uid: currentUser.uid,
          fcmToken: token,
          fcmTokenUpdatedAt: serverTimestamp(),
          platform: Platform.OS,
          role: role,
        },
        { merge: true },
      );

      console.log(
        `[Notification Service] FCM token saved to Firestore for ${role}...`,
      );
    } catch (error) {
      console.error("[Notification Service] Error saving FCM token:", error);
    }
  }

  /**
   * Remove FCM token from Firestore (call on logout)
   */
  async removeFCMToken(): Promise<void> {
    try {
      const { currentUser } = getAuth();
      if (!currentUser) {
        return;
      }

      const firestore = getFirestore();
      const userDocRef = doc(firestore, "users", currentUser.uid);

      await updateDoc(userDocRef, {
        fcmToken: deleteField(),
        fcmTokenUpdatedAt: serverTimestamp(),
      });

      console.log("[Notification Service] FCM token removed from Firestore...");
    } catch (error) {
      console.error("[Notification Service] Error removing FCM token:", error);
    }
  }

  /**
   * Initialize notification service
   * - Request permissions
   * - Get and save FCM token (with user role)
   * - Set up token refresh listener
   */
  async initialize(): Promise<void> {
    try {
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.log("[Notification Service] Notification permission denied");
        return;
      }

      await this.saveFCMToken();

      // Listen for token refresh
      const messaging = getMessaging();
      onTokenRefresh(messaging, async () => {
        console.log("[Notification Service] FCM token refreshed");
        await this.saveFCMToken();
      });
    } catch (error) {
      console.error(
        "[Notification Service] Error initializing notification service:",
        error,
      );
    }
  }
}

export const notificationService = NotificationService.getInstance();
