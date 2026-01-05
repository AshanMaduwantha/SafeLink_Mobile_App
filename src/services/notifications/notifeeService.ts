/**
 * Notifee Service - Handles local notification display and interactions
 */

import notifee, { AndroidImportance, EventType } from "@notifee/react-native";
import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";

type RemoteMessage = FirebaseMessagingTypes.RemoteMessage;
type NotificationPressHandler = (notification: RemoteMessage) => void;

export class NotifeeService {
  private static instance: NotifeeService;
  private onNotificationPressHandler: NotificationPressHandler | null = null;

  private constructor() {}

  static getInstance(): NotifeeService {
    if (!NotifeeService.instance) {
      NotifeeService.instance = new NotifeeService();
    }
    return NotifeeService.instance;
  }

  /**
   * Create notification channel for Android
   */
  async createChannel(): Promise<void> {
    await notifee.createChannel({
      id: "default",
      name: "Default Notifications",
      importance: AndroidImportance.HIGH,
      sound: "default",
    });
  }

  /**
   * Display a notification using notifee
   */
  async displayNotification(remoteMessage: RemoteMessage): Promise<void> {
    try {
      const { data } = remoteMessage;

      // Extract title and body from data
      const title =
        data?.title && typeof data.title === "string" ? data.title : "";
      const body = data?.body && typeof data.body === "string" ? data.body : "";

      if (!title && !body) {
        console.log("[Notifee Service] No title or body found, skipping");
        return;
      }

      // Ensure channel is created
      await this.createChannel();

      // Display notification with notifee
      await notifee.displayNotification({
        title,
        body,
        android: {
          channelId: "default",
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: "default",
          },
          smallIcon: "ic_launcher",
          color: "#2176FF",
        },
        ios: {
          sound: "default",
          foregroundPresentationOptions: {
            banner: true,
            sound: true,
            badge: true,
          },
        },
        data: data as Record<string, string>,
      });

      console.log("[Notifee Service] Notification displayed via notifee");
    } catch (error) {
      console.error("[Notifee Service] Error displaying notification:", error);
    }
  }

  /**
   * Set handler for notification press events
   */
  setOnNotificationPressHandler(handler: NotificationPressHandler): void {
    this.onNotificationPressHandler = handler;
  }

  /**
   * Initialize notifee event listeners
   */
  initialize(): void {
    // Create notification channel
    this.createChannel().catch((err) =>
      console.error("Error creating notification channel:", err),
    );

    // Handle background notification press
    // eslint-disable-next-line require-await
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        const { notification } = detail;
        if (notification?.data && this.onNotificationPressHandler) {
          this.onNotificationPressHandler({
            data: notification.data as Record<string, any>,
          } as RemoteMessage);
        }
      }
    });

    // Handle foreground notification press
    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        const { notification } = detail;
        if (notification?.data && this.onNotificationPressHandler) {
          this.onNotificationPressHandler({
            data: notification.data as Record<string, any>,
          } as RemoteMessage);
        }
      }
    });
  }
}

export const notifeeService = NotifeeService.getInstance();
