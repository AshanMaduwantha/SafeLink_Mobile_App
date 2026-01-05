/**
 * Notification Storage Service - Handles local storage of notifications
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";

type RemoteMessage = FirebaseMessagingTypes.RemoteMessage;

export interface StoredNotification {
  id: string;
  title: string;
  message: string;
  message2?: string;
  time: string;
  date: string;
  icon: string;
  timestamp: number;
  data?: Record<string, any>;
}

const STORAGE_KEY = "@notifications";
const MAX_NOTIFICATIONS = 100; // Limit stored notifications

export class NotificationStorageService {
  private static instance: NotificationStorageService;

  private constructor() {}

  static getInstance(): NotificationStorageService {
    if (!NotificationStorageService.instance) {
      NotificationStorageService.instance = new NotificationStorageService();
    }
    return NotificationStorageService.instance;
  }

  /**
   * Format time relative to now (e.g., "5m", "1h", "2 days")
   */
  private formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} ${days === 1 ? "day" : "days"}`;
    } else if (hours > 0) {
      return `${hours}${hours === 1 ? "h" : "h"}`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return "now";
    }
  }

  /**
   * Format date header (e.g., "Today", "Yesterday", "Monday", etc.)
   */
  private formatDateHeader(timestamp: number): string {
    const now = new Date();
    const notificationDate = new Date(timestamp);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const notificationDay = new Date(
      notificationDate.getFullYear(),
      notificationDate.getMonth(),
      notificationDate.getDate(),
    );

    const diffTime = today.getTime() - notificationDay.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return days[notificationDate.getDay()];
    } else {
      return notificationDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          notificationDate.getFullYear() !== now.getFullYear()
            ? "numeric"
            : undefined,
      });
    }
  }

  /**
   * Convert RemoteMessage to StoredNotification
   */
  private convertToStoredNotification(
    remoteMessage: RemoteMessage,
  ): StoredNotification {
    const timestamp = Date.now();
    const { data } = remoteMessage;

    // Extract title and body from data
    const title =
      (data?.title && typeof data.title === "string" ? data.title : "") ||
      "Notification";
    const body =
      (data?.body && typeof data.body === "string" ? data.body : "") || "";

    // Determine icon based on notification type
    let icon = "notifications-outline";
    if (data?.type === "class_schedule_reminder") {
      icon = "calendar-outline";
    } else if (data?.type === "promotion") {
      icon = "pricetag-outline";
    } else if (data?.type === "news") {
      icon = "newspaper-outline";
    }

    return {
      id: `${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      message: body,
      message2:
        (data?.subtitle && typeof data.subtitle === "string"
          ? data.subtitle
          : "") || "",
      time: this.formatRelativeTime(timestamp),
      date: this.formatDateHeader(timestamp),
      icon,
      timestamp,
      data: data as Record<string, any>,
    };
  }

  /**
   * Get all stored notifications
   */
  async getNotifications(): Promise<StoredNotification[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) {
        return [];
      }
      const notifications: StoredNotification[] = JSON.parse(data);
      // Update relative times for all notifications
      return notifications.map((notif) => ({
        ...notif,
        time: this.formatRelativeTime(notif.timestamp),
        date: this.formatDateHeader(notif.timestamp),
      }));
    } catch (error) {
      console.error("Error getting notifications:", error);
      return [];
    }
  }

  /**
   * Save a notification to storage
   */
  async saveNotification(remoteMessage: RemoteMessage): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const newNotification = this.convertToStoredNotification(remoteMessage);

      // Add new notification at the beginning
      notifications.unshift(newNotification);

      // Limit the number of stored notifications
      const limitedNotifications = notifications.slice(0, MAX_NOTIFICATIONS);

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(limitedNotifications),
      );
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  }

  /**
   * Clear all stored notifications
   */
  async clearNotifications(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  }

  /**
   * Delete a specific notification by ID
   */
  async deleteNotification(id: string): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const filtered = notifications.filter((notif) => notif.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }
}

export const notificationStorage = NotificationStorageService.getInstance();
