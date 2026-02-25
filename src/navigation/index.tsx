import React from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";
import { isReadyRef, navigationRef } from "react-navigation-helpers";
import {
  FirebaseAuthTypes,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  getAuth,
} from "@react-native-firebase/auth";
import AboutScreen from "@screens/about/AboutScreen";
import AccountVerificationScreen from "@screens/account-verification/AccountVerificationScreen";
import DashboardScreen from "@screens/dashboard/DashboardScreen";
import DetailScreen from "@screens/detail/DetailScreen";
import ForgotPasswordCodeScreen from "@screens/forgot-password-code/ForgotPasswordCodeScreen";
import ForgotPasswordScreen from "@screens/forgot-password/ForgotPasswordScreen";
import GetStartedScreen from "@screens/get-started/GetStartedScreen";
import LiveStreamScreen from "@screens/live-stream/LiveStreamScreen";
import LoginScreen from "@screens/login/LoginScreen";
import MyScheduleScreen from "@screens/my-schedule/MyScheduleScreen";
import NotificationScreen from "@screens/notification/NotificationScreen";
import OnboardingScreen from "@screens/onboarding/OnboardingScreen";
import OnboardingScreen2 from "@screens/onboarding/OnboardingScreen2";
import OnboardingScreen3 from "@screens/onboarding/OnboardingScreen3";
import PasswordChangedScreen from "@screens/password-changed/PasswordChangedScreen";
import PasswordResetEmailSentScreen from "@screens/password-reset-email-sent/PasswordResetEmailSentScreen";
import ContactUsScreen from "@screens/profile/ContactUsScreen";
import MyAccountScreen from "@screens/profile/MyAccountScreen";
import ProfileScreen from "@screens/profile/ProfileScreen";
import ResetPasswordScreen from "@screens/reset-password/ResetPasswordScreen";
import SafetyAlertsScreen from "@screens/safety-monitor/SafetyAlertsScreen";
import SafetyInsightsScreen from "@screens/safety-monitor/SafetyInsightsScreen";
import SafetyMonitorWomenChildrenScreen from "@screens/safety-monitor/SafetyMonitorWomenChildrenScreen";
import ViewHeatmapScreen from "@screens/safety-monitor/ViewHeatmapScreen";
import SignUpScreen from "@screens/signup/SignUpScreen";
import TimeTableScreen from "@screens/time-table/TimeTableScreen";
import { VoiceNoteScreen } from "@screens/voice-note";
import { FormattedClass } from "@services/models";
import {
  initializeNotificationHandlers,
  setNavigationRef,
} from "@services/notifications/notificationHandlers";
import { notificationService } from "@services/notifications/notifications";
import { SCREENS } from "@shared-constants";
import fonts from "@theme/fonts";
import { DarkTheme, LightTheme, palette } from "@theme/themes";

export type RootStackParamList = {
  [SCREENS.ONBOARDING]: undefined;
  [SCREENS.ONBOARDING_2]: undefined;
  [SCREENS.ONBOARDING_3]: undefined;
  [SCREENS.GET_STARTED]: undefined;
  [SCREENS.LOGIN]: undefined;
  [SCREENS.SIGNUP]: undefined;
  [SCREENS.FORGOT_PASSWORD]: undefined;
  [SCREENS.FORGOT_PASSWORD_CODE]: undefined;
  [SCREENS.PASSWORD_RESET_EMAIL_SENT]: undefined;
  [SCREENS.RESET_PASSWORD]: { oobCode?: string };
  [SCREENS.PASSWORD_CHANGED]: undefined;
  [SCREENS.ROOT]:
    | {
        screen:
          | typeof SCREENS.HOME
          | typeof SCREENS.TIME_TABLE
          | typeof SCREENS.PROFILE;
      }
    | undefined;
  [SCREENS.DETAIL]: undefined;
  [SCREENS.TIME_TABLE]: { classData: FormattedClass };
  [SCREENS.CLASSES]: undefined;
  [SCREENS.NOTIFICATION]: undefined;
  [SCREENS.MY_ACCOUNT]: undefined;
  [SCREENS.ABOUT]: undefined;
  [SCREENS.CONTACT_US]: undefined;
  [SCREENS.ACCOUNT_VERIFICATION]: undefined;
  [SCREENS.LIVE_STREAM]: { meetingId: string };
  [SCREENS.VOICE_NOTE]: undefined;
  [SCREENS.SAFETY_MONITOR]: undefined;
  [SCREENS.SAFETY_MONITOR_WOMEN_CHILDREN]: undefined;
  [SCREENS.VIEW_HEATMAP]: undefined;
  [SCREENS.SAFETY_ALERTS]: undefined;
  [SCREENS.SAFETY_INSIGHTS]: undefined;
  [SCREENS.REPORT_VIOLATION]: undefined;
  [SCREENS.DRIVE_MODE]: undefined;
  [SCREENS.MY_REPORTS]: undefined;
};

export type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof SCREENS.LOGIN
>;

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const MainTabs = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";
  const activeTabColor = "#FF3B30";
  const inactiveTabColor = "#8B95A1";
  const hiddenTabScreenOptions = {
    tabBarButton: () => null,
    tabBarItemStyle: { display: "none" as const },
  };

  const renderTabIcon = (
    route: any,
    focused: boolean,
    color: string,
    size: number,
  ) => {
    let iconName;
    switch (route.name) {
      case SCREENS.HOME:
        iconName = "home-outline";
        break;
      case SCREENS.TIME_TABLE:
        iconName = "heart-outline";
        break;

      case SCREENS.CLASSES:
        iconName = "location-outline";
        break;
      case SCREENS.PROFILE:
        iconName = "person-outline";
        break;
      default:
        iconName = "home-outline";
        break;
    }
    return (
      <View style={styles.tabIconContainer}>
        <Icon name={iconName} size={size} color={focused ? activeTabColor : color} />
      </View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) =>
          renderTabIcon(route, focused, color, size),
        tabBarShowLabel: true,
        tabBarActiveTintColor: activeTabColor,
        tabBarInactiveTintColor: inactiveTabColor,
        tabBarLabelStyle: {
          fontFamily: fonts.poppins.regular,
          fontSize: 12,
          lineHeight: 16,
          marginTop: 4,
          marginBottom: Platform.OS === "ios" ? 4 : 8,
        },
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: isDarkMode ? palette.black : palette.white,
          height: Platform.OS === "ios" ? 84 : 72,
          paddingBottom: Platform.OS === "ios" ? 18 : 10,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.02,
          shadowRadius: 2,
          elevation: 2,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarItemStyle: {
          paddingTop: 2,
        },
      })}
    >
      <Tab.Screen name={SCREENS.HOME} component={DashboardScreen} />
      <Tab.Screen
        name={SCREENS.TIME_TABLE}
        component={TimeTableScreen}
        options={{ tabBarLabel: "Support" }}
      />
      <Tab.Screen
        name={SCREENS.CLASSES}
        component={MyScheduleScreen}
        options={{ tabBarLabel: "Nearby" }}
      />
      <Tab.Screen
        name={SCREENS.PROFILE}
        component={ProfileScreen}
        options={{ tabBarLabel: "Profile" }}
      />
      <Tab.Screen
        name={SCREENS.DETAIL}
        component={DetailScreen}
        options={hiddenTabScreenOptions}
      />
      <Tab.Screen
        name={SCREENS.NOTIFICATION}
        component={NotificationScreen}
        options={hiddenTabScreenOptions}
      />
      <Tab.Screen
        name={SCREENS.MY_ACCOUNT}
        component={MyAccountScreen}
        options={hiddenTabScreenOptions}
      />
      <Tab.Screen
        name={SCREENS.ABOUT}
        component={AboutScreen}
        options={hiddenTabScreenOptions}
      />
      <Tab.Screen
        name={SCREENS.CONTACT_US}
        component={ContactUsScreen}
        options={hiddenTabScreenOptions}
      />
      <Tab.Screen
        name={SCREENS.LIVE_STREAM}
        component={LiveStreamScreen}
        options={hiddenTabScreenOptions}
      />
      <Tab.Screen
        name={SCREENS.VOICE_NOTE}
        component={VoiceNoteScreen}
        options={hiddenTabScreenOptions}
      />
      <Tab.Screen
        name={SCREENS.SAFETY_MONITOR}
        getComponent={() =>
          require("@screens/traffic-violation/SafetyMonitorScreen").default
        }
        options={hiddenTabScreenOptions}
      />
      <Tab.Screen
        name={SCREENS.SAFETY_MONITOR_WOMEN_CHILDREN}
        component={SafetyMonitorWomenChildrenScreen}
        options={hiddenTabScreenOptions}
      />
      <Tab.Screen
        name={SCREENS.VIEW_HEATMAP}
        component={ViewHeatmapScreen}
        options={hiddenTabScreenOptions}
      />
      <Tab.Screen
        name={SCREENS.SAFETY_ALERTS}
        component={SafetyAlertsScreen}
        options={hiddenTabScreenOptions}
      />
      <Tab.Screen
        name={SCREENS.SAFETY_INSIGHTS}
        component={SafetyInsightsScreen}
        options={hiddenTabScreenOptions}
      />
      <Tab.Screen
        name={SCREENS.REPORT_VIOLATION}
        getComponent={() =>
          require("@screens/traffic-violation/ReportViolationScreen").default
        }
        options={hiddenTabScreenOptions}
      />
      <Tab.Screen
        name={SCREENS.DRIVE_MODE}
        getComponent={() =>
          require("@screens/traffic-violation/DriveModeScreen").default
        }
        options={hiddenTabScreenOptions}
      />
      <Tab.Screen
        name={SCREENS.MY_REPORTS}
        getComponent={() =>
          require("@screens/traffic-violation/MyReportsScreen").default
        }
        options={hiddenTabScreenOptions}
      />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";
  const [initializing, setInitializing] = React.useState(true);
  const [user, setUser] = React.useState<FirebaseAuthTypes.User | null>(null);

  // Handle user state changes
  const onAuthStateChanged = React.useCallback(
    (user: FirebaseAuthTypes.User | null) => {
      setUser(user);
      if (initializing) setInitializing(false);
    },
    [initializing],
  );

  React.useEffect(() => {
    const auth = getAuth();
    const subscriber = firebaseOnAuthStateChanged(auth, onAuthStateChanged);
    return subscriber;
  }, [onAuthStateChanged]);

  React.useEffect((): any => {
    return () => (isReadyRef.current = false);
  }, []);

  // Initialize notification handlers
  React.useEffect(() => {
    const unsubscribe = initializeNotificationHandlers();
    return unsubscribe;
  }, []);

  // Initialize notifications when user logs in
  React.useEffect(() => {
    if (user) {
      notificationService.initialize().catch((err) => {
        console.error("Error initializing notifications:", err);
      });
    } else {
      // Remove FCM token on logout
      notificationService.removeFCMToken().catch((err) => {
        console.error("Error removing FCM token:", err);
      });
    }
  }, [user]);

  if (initializing) {
    // Show loading indicator while checking auth state
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
        setNavigationRef(navigationRef.current as any);
      }}
      theme={isDarkMode ? DarkTheme : LightTheme}
    >
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={
          user ? SCREENS.ACCOUNT_VERIFICATION : SCREENS.ONBOARDING
        }
      >
        <Stack.Screen name={SCREENS.ONBOARDING} component={OnboardingScreen} />
        <Stack.Screen
          name={SCREENS.ONBOARDING_2}
          component={OnboardingScreen2}
        />
        <Stack.Screen
          name={SCREENS.ONBOARDING_3}
          component={OnboardingScreen3}
        />
        <Stack.Screen name={SCREENS.GET_STARTED} component={GetStartedScreen} />
        <Stack.Screen name={SCREENS.LOGIN} component={LoginScreen} />
        <Stack.Screen name={SCREENS.SIGNUP} component={SignUpScreen} />
        <Stack.Screen
          name={SCREENS.FORGOT_PASSWORD}
          component={ForgotPasswordScreen}
        />
        <Stack.Screen
          name={SCREENS.FORGOT_PASSWORD_CODE}
          component={ForgotPasswordCodeScreen}
        />
        <Stack.Screen
          name={SCREENS.PASSWORD_RESET_EMAIL_SENT}
          component={PasswordResetEmailSentScreen}
        />
        <Stack.Screen
          name={SCREENS.RESET_PASSWORD}
          component={ResetPasswordScreen}
        />
        <Stack.Screen
          name={SCREENS.PASSWORD_CHANGED}
          component={PasswordChangedScreen}
        />
        <Stack.Screen name={SCREENS.ROOT} component={MainTabs} />
        <Stack.Screen
          name={SCREENS.ACCOUNT_VERIFICATION}
          component={AccountVerificationScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.white,
  },
});

export default Navigation;
