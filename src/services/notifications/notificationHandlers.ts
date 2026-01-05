import { NavigationContainerRef } from "@react-navigation/native";
import { RootStackParamList } from "@/navigation";
import {
  FirebaseMessagingTypes,
  getInitialNotification,
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import { SCREENS } from "@shared-constants";
import { notifeeService } from "./notifeeService";
import { notificationStorage } from "./notificationStorage";

type RemoteMessage = FirebaseMessagingTypes.RemoteMessage;

const messagingInstance = getMessaging();

let navigationRef: NavigationContainerRef<RootStackParamList> | null = null;

/**
 * Set navigation reference for deep linking from notifications
 */
export function setNavigationRef(
  ref: NavigationContainerRef<RootStackParamList> | null,
) {
  navigationRef = ref;
}

/**
 * Handle notification navigation
 */
function handleNotificationPress(notification: RemoteMessage) {
  try {
    const { data } = notification;

    if (!data || !navigationRef) {
      return;
    }

    // Navigate to ClassSchedule screen with class data
    if (data.type === "class_schedule_reminder" && data.classId) {
      setTimeout(() => {
        let parsedSchedule = [];
        if (data.schedule && typeof data.schedule === "string") {
          try {
            parsedSchedule = JSON.parse(data.schedule);
          } catch (e) {
            console.error("Error parsing schedule:", e);
          }
        }

        navigationRef?.navigate(SCREENS.CLASS_SCHEDULE, {
          classData: {
            id: data.classId,
            title: data.classTitle || "Class",
            description: data.classDescription || "",
            instructor: data.instructor || "",
            schedule: parsedSchedule,
          },
        } as any);
      }, 500);
    }
  } catch (error) {
    console.error("Error handling notification press:", error);
  }
}

/**
 * Display local notification for foreground messages
 */
async function displayForegroundNotification(remoteMessage: RemoteMessage) {
  // Ignore empty notifications
  if (!remoteMessage.data?.title) {
    console.log("[Notification Handlers] Ignoring empty notification");
    return;
  }

  // Store notification
  await notificationStorage.saveNotification(remoteMessage);
  // Display notification
  await notifeeService.displayNotification(remoteMessage);
}

/**
 * Set up foreground notification handler
 * Shows notification even when app is in foreground
 */
export function setupForegroundNotificationHandler() {
  return onMessage(messagingInstance, async (remoteMessage) => {
    console.log(
      "[Notification Handlers] Foreground notification received:",
      remoteMessage,
    );

    // Display the notification
    await displayForegroundNotification(remoteMessage);
  });
}

/**
 * Set up background notification handler
 * Handles notifications when app is in background or quit state
 */
export function setupBackgroundNotificationHandler() {
  setBackgroundMessageHandler(
    messagingInstance,
    async (remoteMessage: RemoteMessage) => {
      console.log(
        "[Notification Handlers] Background notification received:",
        remoteMessage,
      );

      // Ignore empty notifications
      if (!remoteMessage.data?.title) {
        console.log("[Notification Handlers] Ignoring empty notification");
        return Promise.resolve();
      }

      // Store notification
      await notificationStorage.saveNotification(remoteMessage);

      // Display notification using notifee for custom styling
      await notifeeService.displayNotification(remoteMessage);

      return Promise.resolve();
    },
  );
}

/**
 * Set up notification opened handler
 * Handles when user taps on a notification
 */
export function setupNotificationOpenedHandler() {
  // Handle notification opened from quit state
  getInitialNotification(messagingInstance)
    .then(async (remoteMessage) => {
      if (remoteMessage) {
        console.log(
          "[Notification Handlers] Notification opened app from quit state:",
          remoteMessage,
        );
        // Store notification if not already stored
        await notificationStorage.saveNotification(remoteMessage);
        handleNotificationPress(remoteMessage);
      }
    })
    .catch((error) => {
      console.error("Error getting initial notification:", error);
    });

  // Handle notification opened from background state
  return onNotificationOpenedApp(messagingInstance, async (remoteMessage) => {
    console.log(
      "[Notification Handlers] Notification opened app from background state:",
      remoteMessage,
    );
    // Store notification if not already stored
    await notificationStorage.saveNotification(remoteMessage);
    handleNotificationPress(remoteMessage);
  });
}

/**
 * Initialize all notification handlers
 */
export function initializeNotificationHandlers() {
  // Initialize notifee service and set up event handlers
  notifeeService.initialize();
  notifeeService.setOnNotificationPressHandler(handleNotificationPress);

  // Set up Firebase handlers
  const unsubscribeForeground = setupForegroundNotificationHandler();
  const unsubscribeOpened = setupNotificationOpenedHandler();
  setupBackgroundNotificationHandler();

  return () => {
    unsubscribeForeground();
    unsubscribeOpened();
  };
}
