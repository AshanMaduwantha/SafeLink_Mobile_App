import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getSubscriptionDetails } from "@/services/payment";
import TextWrapper from "../../../shared/components/text-wrapper/TextWrapper";
import fonts from "../../../shared/theme/fonts";
import { styles } from "./BillingInfo.style";

interface BillingDateProps {
  onSubscriptionLoaded?: (hasSubscription: boolean) => void;
}

const BillingDate: React.FC<BillingDateProps> = ({ onSubscriptionLoaded }) => {
  const [nextBillingDate, setNextBillingDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);

  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      try {
        setIsLoading(true);
        const subscription = await getSubscriptionDetails();

        if (subscription && subscription.currentPeriodEnd) {
          // Format the date
          const date = new Date(subscription.currentPeriodEnd);
          const formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          setNextBillingDate(formattedDate);
          setCancelAtPeriodEnd(subscription.cancelAtPeriodEnd);
          onSubscriptionLoaded?.(true);
        } else {
          setNextBillingDate(null);
          onSubscriptionLoaded?.(false);
        }
      } catch (error) {
        console.error("Error fetching subscription info:", error);
        setNextBillingDate(null);
        onSubscriptionLoaded?.(false);
      } finally {
        setIsLoading(false);
      }
    };

    //eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchSubscriptionInfo();
  }, [onSubscriptionLoaded]);

  // Don't render anything if there's no subscription
  if (!nextBillingDate && !isLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Next Billing Date */}
      <View style={styles.billingDateContainer}>
        <TextWrapper
          fontFamily={fonts.poppins.regular}
          style={styles.billingLabel}
        >
          {cancelAtPeriodEnd ? "Membership Ends On" : "Next Billing Date"}
        </TextWrapper>
        {isLoading ? (
          <ActivityIndicator size="small" color="#2563EB" />
        ) : (
          <TextWrapper
            fontFamily={fonts.poppins.regular}
            style={styles.billingDate}
          >
            {nextBillingDate}
          </TextWrapper>
        )}
      </View>
      {cancelAtPeriodEnd && (
        <View style={styles.cancellationMessageContainer}>
          <TextWrapper
            fontFamily={fonts.poppins.regular}
            style={styles.cancellationMessage}
          >
            Your membership will be cancelled at the end of this billing period
          </TextWrapper>
        </View>
      )}
    </View>
  );
};

export default BillingDate;
