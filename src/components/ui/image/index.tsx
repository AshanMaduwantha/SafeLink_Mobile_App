"use client";

import React from "react";
import { Image as RNImage } from "react-native";
import { tva, type VariantProps } from "@gluestack-ui/utils/nativewind-utils";

const imageStyle = tva({
  base: "object-cover",
  variants: {
    size: {
      xs: "w-4 h-4",
      sm: "w-6 h-6",
      md: "w-8 h-8",
      lg: "w-12 h-12",
      xl: "w-16 h-16",
      "2xl": "w-20 h-20",
      "3xl": "w-24 h-24",
      full: "w-full h-full",
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      "3xl": "rounded-3xl",
      full: "rounded-full",
    },
  },
  defaultVariants: {
    size: "md",
    rounded: "md",
  },
});

type IImageProps = React.ComponentProps<typeof RNImage> &
  VariantProps<typeof imageStyle> & {
    className?: string;
  };

export const Image = React.forwardRef<
  React.ElementRef<typeof RNImage>,
  IImageProps
>(({ className, size, rounded, ...props }, ref) => {
  return (
    <RNImage
      ref={ref}
      className={imageStyle({ size, rounded, className })}
      {...props}
    />
  );
});

Image.displayName = "Image";
