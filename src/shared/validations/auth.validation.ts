import { z } from "zod";

/**
 * Validation schema for user login
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "please enter your email address")
    .email("please enter a valid email address"),
  password: z.string().min(1, "please enter your password"),
});

/**
 * Validation schema for user sign up
 */
export const signUpSchema = z.object({
  title: z.string().min(1, "please select a title"),
  name: z
    .string()
    .min(1, "please enter your name")
    .max(50, "name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "name can only contain letters and spaces")
    .trim(),
  phone: z
    .string()
    .min(1, "please enter your phone number")
    .regex(/^[\d\s()+-]+$/, "please enter a valid phone number")
    .min(10, "phone number must be at least 10 digits")
    .max(20, "phone number must be less than 20 characters"),
  email: z
    .string()
    .min(1, "please enter your email address")
    .email("please enter a valid email address"),
  password: z.string().min(6, "password must be at least 6 characters long"),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "please agree to the terms & conditions to continue",
  }),
});

/**
 * Type inference for login form data
 */
export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Type inference for sign up form data
 */
export type SignUpFormData = z.infer<typeof signUpSchema>;

/**
 * Validation schema for profile update
 */
export const profileUpdateSchema = z.object({
  title: z.string().optional(),
  name: z
    .string()
    .min(1, "please enter your name")
    .max(50, "name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "name can only contain letters and spaces")
    .trim(),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true;
        return (
          /^[\d\s()+-]+$/.test(val) && val.length >= 10 && val.length <= 20
        );
      },
      {
        message: "please enter a valid phone number (10-20 digits)",
      },
    ),
  address: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true;
        return val.length <= 200;
      },
      {
        message: "address must be less than 200 characters",
      },
    ),
  email: z
    .string()
    .min(1, "please enter your email address")
    .email("please enter a valid email address"),
});

/**
 * Type inference for profile update form data
 */
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
