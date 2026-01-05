import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { pick } from "@react-native-documents/picker";
import { getAuth, reload, updateProfile } from "@react-native-firebase/auth";
import Screen from "../../components/Screen";
import { Button, ButtonText } from "../../components/ui/button";
import { Input, InputField } from "../../components/ui/input";
import { S3Service } from "../../services/s3";
import {
  getUserProfile,
  upsertUserProfile,
} from "../../services/user/user.service";
import TextWrapper from "../../shared/components/text-wrapper/TextWrapper";
import fonts from "../../shared/theme/fonts";
import { profileUpdateSchema } from "../../shared/validations/auth.validation";
import { getAvatarProps } from "../../utils/avatar";
import { styles } from "./styles/MyAccountScreen.style";

const Field = ({
  label,
  placeholder,
  isSelect = false,
  value,
  onPress,
  onChangeText,
  editable = true,
  keyboardType,
}: {
  label: string;
  placeholder: string;
  isSelect?: boolean;
  value?: string;
  onPress?: () => void;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad";
}) => {
  return (
    <View style={styles.fieldContainer}>
      <TextWrapper style={styles.fieldLabel} fontFamily={fonts.poppins.regular}>
        {label}
      </TextWrapper>
      {isSelect ? (
        <TouchableOpacity
          style={[styles.input, styles.selectTrigger]}
          onPress={onPress}
        >
          <Text
            style={[
              styles.selectText,
              value ? styles.selectedText : styles.placeholderText,
            ]}
          >
            {value || placeholder}
          </Text>
          <Icon name="chevron-down-outline" size={16} color="#888" />
        </TouchableOpacity>
      ) : (
        <Input style={styles.input}>
          <InputField
            placeholder={placeholder}
            value={value || ""}
            editable={editable}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            style={styles.inputField}
          />
        </Input>
      )}
    </View>
  );
};

const MyAccountScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;

  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [showTitleDropdown, setShowTitleDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isPickingImage, setIsPickingImage] = useState(false);
  const [currentPhotoURL, setCurrentPhotoURL] = useState<string | null>(null);

  // Check if user signed in with Google
  const isGoogleUser = user?.providerData.some(
    (provider) => provider.providerId === "google.com",
  );

  // Original values to track changes
  const [originalData, setOriginalData] = useState({
    title: "",
    name: "",
    phone: "",
    address: "",
    photoURL: "",
  });

  const titleOptions = [
    { label: "Mr", value: "Mr" },
    { label: "Mrs", value: "Mrs" },
    { label: "Miss", value: "Miss" },
    { label: "Dr", value: "Dr" },
    { label: "Prof", value: "Prof" },
    { label: "Sir", value: "Sir" },
    { label: "Madam", value: "Madam" },
  ];

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const profile = await getUserProfile(user.uid);
        if (profile) {
          const titleValue = profile.title || "";
          const nameValue = profile.name || user.displayName || "";
          const emailValue = profile.email || user.email || "";
          const phoneValue = profile.phone || "";
          const addressValue = profile.address || "";

          setTitle(titleValue);
          setName(nameValue);
          setEmail(emailValue);
          setPhone(phoneValue);
          setAddress(addressValue);

          // Store original data for change tracking
          const photoURLValue = profile.photoURL || user.photoURL || "";
          setOriginalData({
            title: titleValue,
            name: nameValue,
            phone: phoneValue,
            address: addressValue,
            photoURL: photoURLValue,
          });
          setCurrentPhotoURL(photoURLValue || null);
        } else {
          const nameValue = user.displayName || "";
          const emailValue = user.email || "";
          const photoURLValue = user.photoURL || "";

          setName(nameValue);
          setEmail(emailValue);

          setOriginalData({
            title: "",
            name: nameValue,
            phone: "",
            address: "",
            photoURL: photoURLValue,
          });
          setCurrentPhotoURL(photoURLValue || null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile().catch((error) => {
      console.error("Error in fetchUserProfile:", error);
    });
  }, [user?.uid, user?.displayName, user?.email, user?.photoURL]);

  // Track changes
  useEffect(() => {
    const hasImageChange = !isGoogleUser && selectedImageUri !== null;
    const changed =
      title !== originalData.title ||
      (!isGoogleUser && name !== originalData.name) ||
      phone !== originalData.phone ||
      address !== originalData.address ||
      hasImageChange;

    setHasChanges(changed);
  }, [
    title,
    name,
    phone,
    address,
    selectedImageUri,
    originalData,
    isGoogleUser,
  ]);

  // Handle image picker
  const handleImagePicker = async () => {
    if (isPickingImage) {
      return;
    }

    try {
      setIsPickingImage(true);
      const [result] = await pick({
        type: ["image/*"],
      });

      if (result && result.uri) {
        setSelectedImageUri(result.uri);
      }
    } catch (error: any) {
      if (error?.name === "AbortError") {
        return;
      }
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    } finally {
      setIsPickingImage(false);
    }
  };

  // Get avatar props
  const displayName = user?.displayName || name || "User";
  const avatarImageUri = selectedImageUri || currentPhotoURL || user?.photoURL;
  const userAvatar = getAvatarProps(displayName, avatarImageUri, "lg");

  // Save profile changes
  const handleSave = async () => {
    if (!user?.uid) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    const validationResult = profileUpdateSchema.safeParse({
      title,
      name,
      email,
      phone,
      address,
    });

    if (!validationResult.success) {
      const [firstError] = validationResult.error.issues;
      Alert.alert("Validation Error", firstError.message);
      return;
    }

    try {
      setSaving(true);

      let uploadedImageUrl: string | null = null;

      // Upload image to S3 if a new image was selected
      if (selectedImageUri && !isGoogleUser) {
        try {
          const oldPhotoURL = originalData.photoURL || user.photoURL;

          if (oldPhotoURL && oldPhotoURL.includes("amazonaws.com")) {
            try {
              await S3Service.deleteImage(oldPhotoURL);
            } catch (deleteError) {
              console.error(
                "Failed to delete old image, continuing with upload:",
                deleteError,
              );
            }
          }

          // Upload new image
          uploadedImageUrl = await S3Service.uploadImage(
            selectedImageUri,
            user.uid,
          );
          console.log("Image uploaded to S3:", uploadedImageUrl);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          Alert.alert(
            "Upload Error",
            "Failed to upload profile image. Please try again.",
          );
          setSaving(false);
          return;
        }
      }
      //Store the image url in the firebase user profile
      if (uploadedImageUrl && !isGoogleUser) {
        await updateProfile(user, {
          photoURL: uploadedImageUrl,
        });
        await reload(user);
        setCurrentPhotoURL(uploadedImageUrl);
      }

      // Update user profile in Firestore
      await upsertUserProfile(user.uid, {
        email,
        name,
        title,
        phone,
        address,
        photoURL: uploadedImageUrl || undefined,
      });

      if (!isGoogleUser && name !== user.displayName) {
        await updateProfile(user, {
          displayName: name,
        });
        await reload(user);
      }

      if (uploadedImageUrl) {
        setSelectedImageUri(null);
      }

      setOriginalData({
        title,
        name,
        phone,
        address,
        photoURL: uploadedImageUrl || originalData.photoURL,
      });

      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={22} color="#333" />
          </TouchableOpacity>
          <TextWrapper
            style={styles.headerTitle}
            fontFamily={fonts.poppins.regular}
          >
            My Account
          </TextWrapper>
          <View style={styles.iconSpacer} />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <TextWrapper
            style={styles.loadingText}
            fontFamily={fonts.poppins.regular}
          >
            Loading profile...
          </TextWrapper>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.avatarSection}>
            <View>
              {userAvatar.hasPhoto || selectedImageUri ? (
                <Image
                  source={{ uri: avatarImageUri! }}
                  style={styles.avatarImage}
                />
              ) : (
                <View
                  style={[
                    styles.avatarImage,
                    styles.avatarContainer,
                    {
                      backgroundColor: userAvatar.color,
                    },
                  ]}
                >
                  <TextWrapper
                    style={[
                      styles.avatarText,
                      styles.avatarTextWithColor,
                      { fontSize: userAvatar.fontSize },
                    ]}
                    fontFamily={fonts.poppins.regular}
                  >
                    {userAvatar.initial}
                  </TextWrapper>
                </View>
              )}
              {!isGoogleUser && (
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={handleImagePicker}
                >
                  <Icon name="camera" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
            <TextWrapper
              style={styles.nameText}
              fontFamily={fonts.poppins.regular}
            >
              {displayName}
            </TextWrapper>
            {!isGoogleUser && (
              <Text style={styles.photoHelpText}>
                Click the camera icon to update your photo
              </Text>
            )}
            {isGoogleUser && (
              <Text style={styles.photoHelpText}>
                Profile photo is synced with your Google account
              </Text>
            )}
          </View>

          <View style={styles.formContainer}>
            <View style={styles.sectionHeaderRow}>
              <TextWrapper
                style={styles.sectionTitle}
                fontFamily={fonts.poppins.regular}
              >
                Personal Information
              </TextWrapper>
              {hasChanges && (
                <Text style={styles.unsavedText}>Unsaved changes</Text>
              )}
            </View>

            <Field
              label="Title"
              placeholder="Select Title"
              isSelect
              value={title}
              onPress={() => setShowTitleDropdown(true)}
            />

            <Modal
              visible={showTitleDropdown}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowTitleDropdown(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowTitleDropdown(false)}
              >
                <View style={styles.dropdownContainer}>
                  {titleOptions.map((option, index) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.dropdownItem,
                        index === titleOptions.length - 1 &&
                          styles.dropdownItemLast,
                      ]}
                      onPress={() => {
                        setTitle(option.value);
                        setShowTitleDropdown(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          title === option.value && styles.dropdownItemSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>

            <Field
              label="Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              editable={!isGoogleUser}
            />
            <Field
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              editable={false}
              keyboardType="email-address"
            />
            <Field
              label="Phone Number"
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={setPhone}
              editable={true}
              keyboardType="phone-pad"
            />
            <Field
              label="Address"
              placeholder="Enter your address"
              value={address}
              onChangeText={setAddress}
              editable={true}
            />

            {isGoogleUser && (
              <Text style={[styles.photoHelpText, styles.googleSyncText]}>
                Name is synced with your Google account and cannot be changed
                here
              </Text>
            )}

            <Button
              size="xl"
              style={styles.saveButton}
              onPress={handleSave}
              isDisabled={saving || !hasChanges}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <ButtonText>Save</ButtonText>
              )}
            </Button>
          </View>
        </ScrollView>
      )}
    </Screen>
  );
};

export default MyAccountScreen;
