import axios from "axios";
import config from "@/config/environment";
import { getAuth, getIdToken } from "@react-native-firebase/auth";

const { API_BASE_URL } = config;

interface CreatePaymentIntentParams {
  payment_type: "drop_in" | "membership" | "class_pack";
  class_id: string;
  class_title: string;
  instructor_name?: string;
  amount: number; // In cents
  currency?: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  membership_id?: string;
  membership_name?: string;
  class_pack_id?: string;
  class_pack_name?: string;
}

interface PaymentIntentResponse {
  status: string;
  message: string;
  data: {
    paymentIntent?: string;
    setupIntent?: string;
    ephemeralKey: string;
    customer: string;
    publishableKey: string;
    subscription?: string;
  };
}

interface VerifyPaymentResponse {
  status: string;
  message: string;
  data: {
    success: boolean;
    status: string;
    metadata?: {
      user_id: string;
      payment_type: string;
      class_id: string;
      class_title: string;
    };
  };
}

export interface OrderHistoryItem {
  id: string;
  user_id: string;
  payment_type: "drop_in" | "membership" | "class_pack";
  payment_method: "card" | "membership_credit" | "class_pack_credit";
  class_id: string;
  class_title: string;
  amount: number;
  currency: string;
  stripe_payment_intent_id?: string;
  status: string;
  membership_id?: string | null;
  membership_name?: string | null;
  class_pack_id?: string | null;
  class_pack_name?: string | null;
  created_at: string;
}

interface OrderHistoryResponse {
  status: string;
  message: string;
  data: OrderHistoryItem[];
}

/**
 * Get Firebase ID token for authentication
 */
const getAuthToken = async (): Promise<string> => {
  const { currentUser } = getAuth();
  if (!currentUser) {
    throw new Error("User not authenticated");
  }
  return await getIdToken(currentUser);
};

/**
 * Create a Payment Intent or Setup Intent for Payment Sheet
 * For memberships, creates a subscription
 * For drop-in and class packs, creates a one-time payment
 */
export const createPaymentIntent = async (
  params: CreatePaymentIntentParams,
): Promise<{
  paymentIntent?: string;
  setupIntent?: string;
  ephemeralKey: string;
  customer: string;
  publishableKey: string;
  subscription?: string;
}> => {
  try {
    const token = await getAuthToken();

    const response = await axios.post<PaymentIntentResponse>(
      `${API_BASE_URL}/payments/create-payment-intent`,
      params,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.status === "success") {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to create payment intent");
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to create payment intent. Please try again.");
  }
};

/**
 * Verify payment status
 */
export const verifyPayment = async (
  paymentIntentId: string,
): Promise<{ success: boolean; status: string }> => {
  try {
    const token = await getAuthToken();

    const response = await axios.get<VerifyPaymentResponse>(
      `${API_BASE_URL}/payments/verify/${paymentIntentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.status === "success") {
      return {
        success: response.data.data.success,
        status: response.data.data.status,
      };
    }

    return { success: false, status: "unknown" };
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return { success: false, status: "error" };
  }
};

/**
 * Get payment history for authenticated user
 */
export const getPaymentHistory = async (): Promise<OrderHistoryItem[]> => {
  try {
    const token = await getAuthToken();

    const response = await axios.get<OrderHistoryResponse>(
      `${API_BASE_URL}/payments/history`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.status === "success") {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to fetch payment history");
  } catch (error: any) {
    console.error("Error fetching payment history:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch payment history. Please try again.");
  }
};

export interface SubscriptionDetails {
  subscriptionId: string;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

interface SubscriptionResponse {
  status: string;
  message: string;
  data: SubscriptionDetails;
}

/**
 * Get subscription details for authenticated user
 */
export const getSubscriptionDetails =
  async (): Promise<SubscriptionDetails | null> => {
    try {
      const token = await getAuthToken();

      const response = await axios.get<SubscriptionResponse>(
        `${API_BASE_URL}/payments/subscription`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.status === "success") {
        return response.data.data;
      }

      return null;
    } catch (error: any) {
      // Return null if no subscription found (404 is expected)
      if (error.response?.status === 404) {
        return null;
      }
      console.error("Error fetching subscription details:", error);
      return null;
    }
  };

/**
 * Cancel subscription at end of period
 */
export const cancelSubscription = async (): Promise<boolean> => {
  try {
    const token = await getAuthToken();

    const response = await axios.post(
      `${API_BASE_URL}/payments/subscription/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.status === "success";
  } catch (error: any) {
    console.error("Error cancelling subscription:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to cancel subscription. Please try again.");
  }
};

/**
 * Reactivate a cancelled subscription
 */
export const reactivateSubscription = async (): Promise<boolean> => {
  try {
    const token = await getAuthToken();

    const response = await axios.post(
      `${API_BASE_URL}/payments/subscription/reactivate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.status === "success";
  } catch (error: any) {
    console.error("Error reactivating subscription:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to reactivate subscription. Please try again.");
  }
};
