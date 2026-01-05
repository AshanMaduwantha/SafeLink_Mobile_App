import React from "react";
import { StyleSheet, TextStyle } from "react-native"; // Import StyleSheet and TextStyle
import fonts from "@fonts";
import RNText, {
  type IRNTextProps,
} from "@freakycoder/react-native-custom-text";

interface ITextWrapperProps extends IRNTextProps {
  fontFamily?: string;
  children?: React.ReactNode;
}

const TextWrapper: React.FC<ITextWrapperProps> = ({
  fontFamily = fonts.poppins.regular,
  children,
  style,
  ...rest
}) => {
  const flattenedStyle = StyleSheet.flatten(style) as TextStyle; // Cast to TextStyle
  const textColor = flattenedStyle?.color || "#757575"; // Default color if not provided in style

  return (
    <RNText
      fontFamily={fontFamily}
      style={[{ color: textColor }, style]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

export default TextWrapper;
