"use client";

import React from "react";
import { Text as RNText } from "react-native";
import { tva, type VariantProps } from "@gluestack-ui/utils/nativewind-utils";

const textStyle = tva({
  base: "text-gray-900",
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    color: {
      primary: "text-blue-600",
      secondary: "text-gray-500",
      success: "text-green-600",
      error: "text-red-600",
      warning: "text-yellow-600",
      muted: "text-gray-400",
    },
  },
  defaultVariants: {
    size: "md",
    weight: "normal",
  },
});

type ITextProps = React.ComponentProps<typeof RNText> &
  VariantProps<typeof textStyle> & {
    className?: string;
  };

export const Text = React.forwardRef<
  React.ElementRef<typeof RNText>,
  ITextProps
>(({ className, size, weight, color, ...props }, ref) => {
  return (
    <RNText
      ref={ref}
      className={textStyle({ size, weight, color, className })}
      {...props}
    />
  );
});

Text.displayName = "Text";
