import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { ZodError } from "zod";
import Screen from "@/components/Screen";
import { HStack } from "@/components/ui/hstack";
import { getAuth } from "@react-native-firebase/auth";
import { submitContactForm } from "../../services/api/contact.service";
import TextWrapper from "../../shared/components/text-wrapper/TextWrapper";
import fonts from "../../shared/theme/fonts";
import {
  contactFormSchema,
  ContactFormSchema,
} from "../../shared/validations/contactFormSchema";
import { styles } from "./styles/ContactUsScreen.style";

const inquiryTypes = [
  { label: "General Inquiry", value: "general" },
  { label: "Technical Support", value: "technical" },
  { label: "Billing Question", value: "billing" },
  { label: "Feedback", value: "feedback" },
  { label: "Other", value: "other" },
];

const ContactUsScreen = () => {
  const navigation = useNavigation();
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [inquiryType, setInquiryType] = useState(inquiryTypes[0].value);
  const [message, setMessage] = useState("");
  const [showInquiryTypeDropdown, setShowInquiryTypeDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { currentUser } = getAuth();
    if (currentUser?.email) {
      setEmail(currentUser.email);
    }
  }, []);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const formData: ContactFormSchema = {
        subject,
        email,
        inquiryType,
        message,
      };

      contactFormSchema.parse(formData);

      await submitContactForm(formData);
      Alert.alert(
        "Success",
        "Your inquiry has been submitted. We will get back to you shortly.",
      );
      navigation.goBack();
    } catch (error: any) {
      console.error("[ContactUsScreen] Error submitting form:", error);
      if (error instanceof ZodError) {
        const errorMessage = error.issues
          .map((issue) => issue.message)
          .join("\n");
        Alert.alert("Validation Error", errorMessage);
      } else {
        Alert.alert(
          "Error",
          error.message || "Failed to submit inquiry. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen className="pb-2" style={styles.container}>
      <View style={styles.mainContentContainer}>
        {/* Header */}
        <HStack style={styles.header} className="items-center px-4 py-2">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <TextWrapper
              style={styles.title}
              fontFamily={fonts.poppins.regular}
              className="text-2xl font-bold mr-10"
            >
              Contact Us
            </TextWrapper>
          </View>
        </HStack>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.formGroup}>
            <TextWrapper
              style={styles.label}
              fontFamily={fonts.poppins.regular}
            >
              Subject:
            </TextWrapper>
            <TextInput
              style={styles.input}
              placeholder="Enter subject"
              value={subject}
              onChangeText={setSubject}
              editable={!loading}
            />
          </View>

          {/* New Email Input */}
          <View style={styles.formGroup}>
            <TextWrapper
              style={styles.label}
              fontFamily={fonts.poppins.regular}
            >
              Email:
            </TextWrapper>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={false}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <TextWrapper
              style={styles.label}
              fontFamily={fonts.poppins.regular}
            >
              Inquiry Type:
            </TextWrapper>
            <TouchableOpacity
              style={[styles.input, styles.selectTrigger]}
              onPress={() =>
                setShowInquiryTypeDropdown(!showInquiryTypeDropdown)
              }
              disabled={loading}
            >
              <TextWrapper
                style={[
                  styles.selectText,
                  inquiryType ? styles.selectedText : styles.placeholderText,
                ]}
                fontFamily={fonts.poppins.regular}
              >
                {inquiryTypes.find((type) => type.value === inquiryType)
                  ?.label || "Select Inquiry Type"}
              </TextWrapper>
              <Icon
                name="chevron-down"
                size={16}
                color="#888"
                style={styles.chevronIcon}
              />
            </TouchableOpacity>

            <Modal
              visible={showInquiryTypeDropdown}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowInquiryTypeDropdown(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowInquiryTypeDropdown(false)}
              >
                <View style={styles.dropdownContainer}>
                  {inquiryTypes.map((option, index) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.dropdownItem,
                        index === inquiryTypes.length - 1 &&
                          styles.dropdownItemLast,
                      ]}
                      onPress={() => {
                        setInquiryType(option.value);
                        setShowInquiryTypeDropdown(false);
                      }}
                    >
                      <TextWrapper
                        style={[
                          styles.dropdownItemText,
                          inquiryType === option.value &&
                            styles.dropdownItemSelected,
                        ]}
                        fontFamily={fonts.poppins.regular}
                      >
                        {option.label}
                      </TextWrapper>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>
          </View>

          <View style={styles.formGroup}>
            <TextWrapper
              style={styles.label}
              fontFamily={fonts.poppins.regular}
            >
              Message:
            </TextWrapper>
            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Enter your message"
              multiline
              numberOfLines={5}
              value={message}
              onChangeText={setMessage}
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <TextWrapper
                style={styles.submitButtonText}
                fontFamily={fonts.poppins.regular}
              >
                Submit
              </TextWrapper>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Screen>
  );
};

export default ContactUsScreen;
