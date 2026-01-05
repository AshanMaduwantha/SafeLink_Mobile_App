import React from "react";
import { LogBox, StatusBar, useColorScheme } from "react-native";
import "react-native-gesture-handler";
import SplashScreen from "react-native-splash-screen";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { isAndroid } from "@freakycoder/react-native-helpers";
import "./global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CustomSplashScreen from "./src/components/SplashScreen";
import { initializeStripe } from "./src/config/stripe";
/**
 * ? Local Imports
 */
import Navigation from "./src/navigation";

LogBox.ignoreAllLogs();

const App = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? "light-content" : "dark-content");
    if (isAndroid) {
      StatusBar.setBackgroundColor("rgba(0,0,0,0)");
      StatusBar.setTranslucent(true);
    }

    // Initialize Stripe
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initializeStripe();

    // Hide native splash screen immediately to prevent showing it
    SplashScreen.hide();

    // Show custom splash for 1.5 seconds
    setTimeout(() => {
      setShowSplash(false);
    }, 1000);
  }, [scheme, isDarkMode]);

  if (showSplash) {
    return <CustomSplashScreen />;
  }

  return (
    <>
      <SafeAreaProvider>
        <GluestackUIProvider>
          <Navigation />
        </GluestackUIProvider>
      </SafeAreaProvider>
    </>
  );
};

export default App;
