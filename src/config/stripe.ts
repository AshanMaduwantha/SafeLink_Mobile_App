import { initStripe } from "@stripe/stripe-react-native";
import config from "./environment";

//Initialize Stripe SDK
export const initializeStripe = async () => {
  try {
    await initStripe({
      publishableKey: config.STRIPE_PUBLISHABLE_KEY,
      merchantIdentifier: "merchant.com.danceacademy", // For Apple Pay
      urlScheme: "danceacademy", // app's URL scheme for redirects
    });
    console.log("Stripe initialized successfully...");
  } catch (error) {
    console.error("Failed to initialize Stripe:", error);
  }
};
