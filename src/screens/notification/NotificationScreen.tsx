import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Screen from "@/components/Screen";
import { HStack } from "@/components/ui/hstack";
import { ScrollView } from "@/components/ui/scrollview";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  notificationStorage,
  StoredNotification,
} from "@/services/notifications/notificationStorage";
import { styles } from "./NotificationScreen.style";

interface NotificationScreenProps {
  navigation: any;
}

const NotificationScreen: React.FC<NotificationScreenProps> = ({
  navigation,
}) => {
  const [notifications, setNotifications] = useState<StoredNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const handleClearAllNotifications = async () => {
    try {
      setLoading(true);
      await notificationStorage.clearNotifications();
      setNotifications([]);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadNotifications();

    // Refresh notifications when screen comes into focus
    const unsubscribe = navigation.addListener("focus", () => {
      //eslint-disable-next-line @typescript-eslint/no-floating-promises
      loadNotifications();
    });

    return unsubscribe;
  }, [navigation]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const storedNotifications = await notificationStorage.getNotifications();
      setNotifications(storedNotifications);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupedNotifications = notifications.reduce(
    (acc, notification) => {
      if (!acc[notification.date]) {
        acc[notification.date] = [];
      }
      acc[notification.date].push(notification);
      return acc;
    },
    {} as Record<string, StoredNotification[]>,
  );

  const renderNotificationItem = (notification: StoredNotification) => (
    <View key={notification.id} style={styles.notificationItem}>
      <HStack className="items-start" space="md">
        {/* Notification Icon */}
        <View style={styles.notificationIcon}>
          <Icon name={notification.icon} size={20} color="#2563EB" />
        </View>

        {/* Notification Content */}
        <VStack className="flex-1" space="xs">
          <Text size="lg" weight="bold" style={styles.notificationTitle}>
            {notification.title}
          </Text>
          <Text size="sm" color="secondary" style={styles.notificationMessage}>
            {notification.message}
          </Text>
          <HStack className="justify-between items-center">
            <Text
              size="sm"
              color="secondary"
              style={styles.notificationMessage2}
            >
              {notification.message2}
            </Text>
            <Text size="sm" color="secondary" style={styles.notificationTime}>
              {notification.time}
            </Text>
          </HStack>
        </VStack>
      </HStack>
    </View>
  );

  return (
    <Screen className="flex-1 bg-white" style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <VStack style={styles.header} className="px-4 " space="md">
        <HStack className="items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="arrow-back"
              size={24}
              color="#374151"
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text size="xl" weight="bold" style={styles.headerTitle}>
            Notifications
          </Text>
          <View style={styles.spacer} />
        </HStack>
      </VStack>

      {/* Notifications List */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {loading && (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#2176FF" />
          </View>
        )}
        {!loading && notifications.length === 0 && (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateIconWrapper}>
              <Icon name="notifications-outline" size={40} color="#2563EB" />
            </View>
            <Text
              size="lg"
              weight="bold"
              style={styles.emptyStateTitle}
              className="text-center"
            >
              There are no notifications
            </Text>
            <Text
              size="sm"
              color="secondary"
              style={styles.emptyStateSubtitle}
              className="mt-2 text-center"
            >
              You&apos;ll be notified about activity on the classes you&apos;re
              enrolled in.
            </Text>
          </View>
        )}
        {!loading && notifications.length > 0 && (
          <VStack className="px-4" space="lg">
            {Object.entries(groupedNotifications).map(
              ([date, dateNotifications]) => (
                <VStack key={date} space="md">
                  {/* Date Header + Mark All As Read */}
                  <HStack className="items-center justify-between">
                    <Text size="sm" color="secondary" style={styles.dateHeader}>
                      {date}
                    </Text>
                    {date === "Today" && (
                      <TouchableOpacity onPress={handleClearAllNotifications}>
                        <Text size="sm" style={styles.markAllText}>
                          Mark All As Read
                        </Text>
                      </TouchableOpacity>
                    )}
                  </HStack>

                  {/* Notifications for this date */}
                  <VStack space="xs">
                    {dateNotifications.map((notification) =>
                      renderNotificationItem(notification),
                    )}
                  </VStack>
                </VStack>
              ),
            )}
          </VStack>
        )}

        {/* Bottom spacing */}
        <View className="h-8" />
      </ScrollView>
    </Screen>
  );
};

export default NotificationScreen;
