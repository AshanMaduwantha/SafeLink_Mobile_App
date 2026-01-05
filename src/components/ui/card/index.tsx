"use client";

import React from "react";
import { View } from "react-native";
import { tva, type VariantProps } from "@gluestack-ui/utils/nativewind-utils";

const cardStyle = tva({
  base: "bg-white border border-gray-200 rounded-lg shadow-sm",
  variants: {
    size: {
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    },
    variant: {
      elevated: "shadow-md",
      outlined: "border-2",
      filled: "bg-gray-50",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "elevated",
  },
});

type ICardProps = React.ComponentProps<typeof View> &
  VariantProps<typeof cardStyle> & {
    className?: string;
  };

type ICardHeaderProps = React.ComponentProps<typeof View> & {
  className?: string;
};

type ICardBodyProps = React.ComponentProps<typeof View> & {
  className?: string;
};

type ICardFooterProps = React.ComponentProps<typeof View> & {
  className?: string;
};

export const Card = React.forwardRef<React.ElementRef<typeof View>, ICardProps>(
  ({ className, size, variant, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cardStyle({ size, variant, className })}
        {...props}
      />
    );
  },
);

export const CardHeader = React.forwardRef<
  React.ElementRef<typeof View>,
  ICardHeaderProps
>(({ className, ...props }, ref) => {
  return <View ref={ref} className={`pb-3 ${className || ""}`} {...props} />;
});

export const CardBody = React.forwardRef<
  React.ElementRef<typeof View>,
  ICardBodyProps
>(({ className, ...props }, ref) => {
  return <View ref={ref} className={`${className || ""}`} {...props} />;
});

export const CardFooter = React.forwardRef<
  React.ElementRef<typeof View>,
  ICardFooterProps
>(({ className, ...props }, ref) => {
  return <View ref={ref} className={`pt-3 ${className || ""}`} {...props} />;
});

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardBody.displayName = "CardBody";
CardFooter.displayName = "CardFooter";
