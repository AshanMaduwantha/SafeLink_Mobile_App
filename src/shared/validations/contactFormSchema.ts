import { z } from "zod";

export const contactFormSchema = z.object({
  subject: z.string().min(1, "Subject is required."),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Invalid email address."),
  inquiryType: z.string().min(1, "Inquiry type is required."),
  message: z.string().min(1, "Message is required."),
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;
