/**
 * Environment Configuration
 *
 * This file manages environment-specific configurations using react-native-config.
 * Configurations are loaded from .env files based on the build scheme.
 */

import Config from "react-native-config";

interface EnvironmentConfig {
  API_BASE_URL: string;
  APP_ENV: "development" | "staging" | "production";
  STRIPE_PUBLISHABLE_KEY: string;

  // S3 Configurations
  S3_DANCEY_MAIN_BUCKET_NAME?: string;
  S3_DANCEY_MAIN_PROFILE_PATH?: string;
  S3_REGION?: string;
  S3_ACCESS_KEY_ID?: string;
  S3_SECRET_ACCESS_KEY?: string;

  // Women & Children S3 Bucket
  S3_BUCKET_NAME?: string;

  // Detection & ML APIs
  DETECTION_API?: string;
  ML_API_URL?: string;
  WEB_PORTAL_API_URL?: string;
}

// Validate required environment variables
const validateConfig = (): EnvironmentConfig => {
  const apiBaseUrl = Config.API_BASE_URL;
  const appEnv = Config.APP_ENV as EnvironmentConfig["APP_ENV"];
  const stripePublishableKey = Config.STRIPE_PUBLISHABLE_KEY;

  if (!apiBaseUrl) {
    throw new Error("API_BASE_URL is not defined in environment configuration");
  }

  if (!appEnv || !["development", "staging", "production"].includes(appEnv)) {
    throw new Error("APP_ENV must be one of: development, staging, production");
  }

  if (!stripePublishableKey) {
    throw new Error(
      "STRIPE_PUBLISHABLE_KEY is not defined in environment configuration",
    );
  }

  return {
    API_BASE_URL: apiBaseUrl,
    APP_ENV: appEnv,
    STRIPE_PUBLISHABLE_KEY: stripePublishableKey,
  };
};

// Export validated configuration
const validatedConfig = validateConfig();

export const config = {
  API_BASE_URL: validatedConfig.API_BASE_URL,
  ENVIRONMENT: validatedConfig.APP_ENV,
  STRIPE_PUBLISHABLE_KEY: validatedConfig.STRIPE_PUBLISHABLE_KEY,
  IS_DEV: validatedConfig.APP_ENV === "development",
  IS_STAGING: validatedConfig.APP_ENV === "staging",
  IS_PROD: validatedConfig.APP_ENV === "production",

  // Women & Children S3 bucket
  S3_BUCKET_NAME: Config.S3_BUCKET_NAME || "women-and-children",
  S3_REGION: Config.S3_REGION || "eu-north-1",
  S3_ACCESS_KEY_ID: Config.S3_ACCESS_KEY_ID || "",
  S3_SECRET_ACCESS_KEY: Config.S3_SECRET_ACCESS_KEY || "",

  // Detection & ML
  DETECTION_API: Config.DETECTION_API || "",
  ML_API_URL: Config.ML_API_URL || "https://ashan26-SafeLink.hf.space",
  WEB_PORTAL_API_URL: Config.WEB_PORTAL_API_URL || "",
};

// Log current environment
if (__DEV__) {
  console.log("Environment Config:", {
    environment: config.ENVIRONMENT,
    apiBaseUrl: config.API_BASE_URL,
    stripePublishableKey: config.STRIPE_PUBLISHABLE_KEY
      ? `${config.STRIPE_PUBLISHABLE_KEY.substring(0, 20)}...`
      : "not set",
  });
}

export default config;
