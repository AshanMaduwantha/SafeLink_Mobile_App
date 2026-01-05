"use client";

import React from "react";
import { View } from "react-native";
import { tva, type VariantProps } from "@gluestack-ui/utils/nativewind-utils";

const hstackStyle = tva({
  base: "flex-row items-center",
  variants: {
    space: {
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
      xl: "gap-6",
      "2xl": "gap-8",
    },
    reversed: {
      true: "flex-row-reverse",
      false: "flex-row",
    },
  },
  defaultVariants: {
    space: "md",
    reversed: false,
  },
});

type IHStackProps = React.ComponentProps<typeof View> &
  VariantProps<typeof hstackStyle> & {
    className?: string;
  };

export const HStack = React.forwardRef<
  React.ElementRef<typeof View>,
  IHStackProps
>(({ className, space, reversed, ...props }, ref) => {
  return (
    <View
      ref={ref}
      className={hstackStyle({
        space: space as "xs" | "sm" | "md" | "lg" | "xl" | "2xl",
        reversed: reversed as boolean,
        className,
      })}
      {...props}
    />
  );
});

HStack.displayName = "HStack";
