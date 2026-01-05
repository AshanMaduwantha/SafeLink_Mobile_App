// import { Alert } from "react-native";
// import { classesService, classPacksService } from "@/services/api";
// import { createPaymentIntent } from "@/services/payment";
// import { getUserProfile } from "@/services/user";
// import { getAuth } from "@react-native-firebase/auth";
// import { SCREENS } from "@shared-constants";

// export interface PaymentOption {
//   id: string;
//   title: string;
//   description: string;
//   price: string;
//   type: "drop-in" | "membership" | "class-pack";
//   isSelected?: boolean;
// }

// type Pricing =
//   | {
//       dropInPrice: number;
//       memberships: Array<{ id: string; name: string; price: number | null }>;
//     }
//   | undefined;

// export function buildPaymentOptions(
//   pricing: Pricing,
//   classPacks?: { id: string; name: string; price: number }[] | null,
// ): PaymentOption[] {
//   const dropIn: PaymentOption = {
//     id: "drop-in",
//     title: "One-Time Payment",
//     description: "Pay a one-time payment to access this class",
//     price:
//       typeof pricing?.dropInPrice === "number"
//         ? new Intl.NumberFormat(undefined, {
//             style: "currency",
//             currency: "AUD",
//           }).format(pricing.dropInPrice)
//         : "$0.00",
//     type: "drop-in",
//   };

//   const memberships: PaymentOption[] = (pricing?.memberships || []).map(
//     (m) => ({
//       id: m.id,
//       title: m.name,
//       description: "Enjoy all classes for one fixed monthly fee",
//       price:
//         typeof m.price === "number" ? `AUD ${m.price.toFixed(2)} /month` : "—",
//       type: "membership",
//     }),
//   );

//   const options: PaymentOption[] = [dropIn, ...memberships];

//   // Add all class packs as payment options
//   if (classPacks && classPacks.length > 0) {
//     const classPackOptions: PaymentOption[] = classPacks
//       .filter((cp) => typeof cp.price === "number")
//       .map((cp) => ({
//         id: `class-pack-${cp.id}`,
//         title: cp.name || "Class Pack",
//         description: "Get 5 credits to book 5 classes",
//         price: new Intl.NumberFormat(undefined, {
//           style: "currency",
//           currency: "AUD",
//         }).format(cp.price),
//         type: "class-pack" as const,
//       }));
//     options.push(...classPackOptions);
//   }

//   return options;
// }

// export async function getEligibleMembershipSet(
//   accessInfo:
//     | {
//         hasMembership: boolean;
//         userMembershipId: string | null;
//         included: boolean;
//         eligibleMemberships: Array<{
//           id: string;
//           membership_name: string;
//           price_per_month: string | null;
//           is_membership_enabled: boolean;
//           status: string;
//         }>;
//       }
//     | undefined,
//   classId: string | undefined,
// ): Promise<Set<string>> {
//   try {
//     if (accessInfo?.eligibleMemberships) {
//       return new Set(accessInfo.eligibleMemberships.map((m) => m.id));
//     }
//     if (classId) {
//       const list = await classesService.getClassMemberships(classId);
//       return new Set(list.map((m) => m.id));
//     }
//   } catch {
//     return new Set();
//   }
//   return new Set();
// }

// export function computeDefaultSelectedOption(
//   paymentOptions: PaymentOption[],
//   selectedOptionId: string,
//   hasMembership: boolean,
// ): string | undefined {
//   const hasCurrent = paymentOptions.some((o) => o.id === selectedOptionId);
//   if (hasCurrent) return undefined;

//   const dropIn = paymentOptions.find((o) => o.type === "drop-in");
//   const classPacks = paymentOptions.filter((o) => o.type === "class-pack");
//   const memberships = paymentOptions.filter((o) => o.type === "membership");

//   const fallback = hasMembership
//     ? dropIn || classPacks[0]
//     : dropIn || memberships[0] || classPacks[0];
//   return fallback?.id;
// }

// /**
//  * Convert price string to cents
//  * Ex: "$25.00" -> 2500
//  */
// function parseAmountToCents(priceString: string): number {
//   const match = priceString.match(/[\d,]+\.?\d*/);
//   if (!match) return 0;
//   const amount = parseFloat(match[0].replace(/,/g, ""));
//   return Math.round(amount * 100);
// }

// export async function performCheckout(args: {
//   classData: { id: string; title: string } | undefined;
//   selectedOptionId: string;
//   paymentOptions: PaymentOption[];
//   eligibleSet: Set<string>;
//   navigation: any;
//   initPaymentSheet: (params: any) => Promise<{ error?: any }>;
//   presentPaymentSheet: () => Promise<{ error?: any }>;
//   classPacks?: Array<{
//     id: string;
//     name: string;
//     creditsRemaining: number | null;
//   }> | null;
// }) {
//   const {
//     classData,
//     selectedOptionId,
//     paymentOptions,
//     eligibleSet,
//     navigation,
//     initPaymentSheet,
//     presentPaymentSheet,
//     classPacks,
//   } = args;

//   if (!classData) {
//     Alert.alert("Error", "Class data not found. Please try again.");
//     return;
//   }

//   const { currentUser } = getAuth();
//   if (!currentUser) {
//     Alert.alert(
//       "Authentication Required",
//       "Please sign in to enroll in this class",
//       [{ text: "OK" }],
//     );
//     return;
//   }

//   const userProfile = await getUserProfile(currentUser.uid);
//   if (!userProfile) {
//     Alert.alert(
//       "Profile Not Found",
//       "Please complete your profile to enroll in classes",
//       [{ text: "OK" }],
//     );
//     return;
//   }

//   const selected = paymentOptions.find((o) => o.id === selectedOptionId);
//   if (!selected) {
//     Alert.alert("Error", "Please select a payment option");
//     return;
//   }

//   // Parse amount from price string
//   const amountInCents = parseAmountToCents(selected.price);

//   if (amountInCents <= 0) {
//     Alert.alert("Error", "Invalid payment amount. Please try again.");
//     return;
//   }

//   // Handle membership with special note if not eligible
//   if (selected.type === "membership") {
//     const isEligible = eligibleSet.has(selected.id);
//     if (!isEligible) {
//       const confirmed = await new Promise<boolean>((resolve) => {
//         Alert.alert(
//           "Note",
//           [
//             "This class isn't included in the selected membership.",
//             "This plan unlocks other classes you can access.",
//             "You can change the membership later in the You section.",
//             "\n\nProceed with payment?",
//           ].join(" "),
//           [
//             { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
//             { text: "Continue", onPress: () => resolve(true) },
//           ],
//         );
//       });
//       if (!confirmed) return;
//     }
//   }

//   // If class pack selected, try to consume existing credit first
//   if (selected.type === "class-pack") {
//     // Extract class pack ID from option ID
//     const classPackId = selectedOptionId.replace("class-pack-", "");
//     // Find the selected class pack to check for credits
//     const selectedClassPack = classPacks?.find((cp) => cp.id === classPackId);
//     const hasCreditsForSelectedPack =
//       selectedClassPack !== undefined &&
//       selectedClassPack.creditsRemaining !== null &&
//       (selectedClassPack.creditsRemaining ?? 0) > 0;

//     if (hasCreditsForSelectedPack) {
//       const useCredit = await new Promise<boolean>((resolve) => {
//         Alert.alert(
//           "Use Class Pack Credit",
//           "Do you want to pay with your class pack? 1 credit will be deducted.",
//           [
//             { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
//             { text: "Use Credit", onPress: () => resolve(true) },
//           ],
//           { cancelable: false },
//         );
//       });
//       if (!useCredit) return;

//       try {
//         const consumed = await classPacksService.consumeCreditForClass({
//           class_id: classData.id,
//           class_title: classData.title,
//           user_name: userProfile.name,
//           user_email: userProfile.email,
//           user_phone: userProfile.phone || undefined,
//           class_pack_id: classPackId,
//         });
//         if (consumed) {
//           Alert.alert(
//             "Enrolled",
//             `One credit was used to enroll in ${classData.title}.`,
//             [
//               {
//                 text: "OK",
//                 onPress: () =>
//                   navigation.navigate(SCREENS.ROOT, {
//                     screen: SCREENS.DASHBOARD,
//                   }),
//               },
//             ],
//           );
//           return;
//         }
//       } catch {
//         // fallthrough to purchase path
//       }
//     }

//     // Confirm purchasing a new class pack when no eligible credits
//     const confirmed = await new Promise<boolean>((resolve) => {
//       Alert.alert(
//         "Purchase Class Pack",
//         "You'll get 5 credits. One credit will be used for this class. Continue with payment?",
//         [
//           { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
//           { text: "Continue", onPress: () => resolve(true) },
//         ],
//         { cancelable: false },
//       );
//     });
//     if (!confirmed) return;
//   }

//   try {
//     // Map payment type to match backend expectations
//     let paymentType: "drop_in" | "membership" | "class_pack";
//     if (selected.type === "class-pack") {
//       paymentType = "class_pack";
//     } else if (selected.type === "drop-in") {
//       paymentType = "drop_in";
//     } else {
//       paymentType = "membership";
//     }

//     // Create Payment Intent or Subscription
//     const response = await createPaymentIntent({
//       payment_type: paymentType,
//       class_id: classData.id,
//       class_title: classData.title,
//       amount: amountInCents,
//       currency: "aud",
//       user_name: userProfile.name,
//       user_email: userProfile.email,
//       user_phone: userProfile.phone || undefined,
//       ...(selected.type === "membership" && {
//         membership_id: selected.id,
//         membership_name: selected.title,
//       }),
//       ...(selected.type === "class-pack" && {
//         // Extract class pack ID from option ID
//         class_pack_id: selectedOptionId.replace("class-pack-", ""),
//         class_pack_name: selected.title,
//       }),
//     });

//     const { paymentIntent, setupIntent, ephemeralKey, customer } = response;

//     // Use paymentIntent (for subscriptions and one-time payments)
//     const clientSecret = paymentIntent || setupIntent;

//     if (!clientSecret) {
//       throw new Error("No payment secret received from server");
//     }

//     // Initialize Payment Sheet
//     const { error: initError } = await initPaymentSheet({
//       merchantDisplayName: "Studio Mate",
//       customerId: customer,
//       customerEphemeralKeySecret: ephemeralKey,
//       paymentIntentClientSecret: clientSecret,
//       allowsDelayedPaymentMethods: true,
//       defaultBillingDetails: {
//         name: userProfile.name,
//         email: userProfile.email,
//       },
//     });

//     if (initError) {
//       throw new Error(initError.message || "Failed to initialize payment");
//     }

//     // Present Payment Sheet
//     const { error: presentError } = await presentPaymentSheet();

//     if (presentError) {
//       // User canceled or error occurred
//       if (presentError.code === "Canceled") {
//         // User canceled, just return without error
//         return;
//       }
//       throw new Error(presentError.message || "Payment failed");
//     }

//     // Payment successful
//     const successMessage =
//       selected.type === "membership"
//         ? `Your ${selected.title} membership has been activated! You have been enrolled in ${classData.title}.`
//         : `You have been enrolled in ${classData.title}!`;

//     Alert.alert("Payment Successful", successMessage, [
//       {
//         text: "OK",
//         onPress: () =>
//           navigation.navigate(SCREENS.ROOT, {
//             screen: SCREENS.DASHBOARD,
//           }),
//       },
//     ]);
//   } catch (error: any) {
//     console.error("Checkout error:", error);
//     throw new Error(
//       error?.message || "Failed to complete payment. Please try again.",
//     );
//   }
// }
