"use client";

import React from "react";
import { ScrollView as RNScrollView } from "react-native";
import { tva, type VariantProps } from "@gluestack-ui/utils/nativewind-utils";

const scrollViewStyle = tva({
  base: "flex-1",
  variants: {
    variant: {
      vertical: "flex-col",
      horizontal: "flex-row",
    },
  },
  defaultVariants: {
    variant: "vertical",
  },
});

type IScrollViewProps = React.ComponentProps<typeof RNScrollView> &
  VariantProps<typeof scrollViewStyle> & {
    className?: string;
  };

export const ScrollView = React.forwardRef<
  React.ElementRef<typeof RNScrollView>,
  IScrollViewProps
>(({ className, variant, ...props }, ref) => {
  return (
    <RNScrollView
      ref={ref}
      className={scrollViewStyle({ variant, className })}
      {...props}
    />
  );
});

ScrollView.displayName = "ScrollView";
