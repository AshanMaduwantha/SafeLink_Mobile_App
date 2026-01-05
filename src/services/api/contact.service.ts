import { ContactFormSchema } from "../../shared/validations/contactFormSchema";
import { apiClient } from "./api-client";

export const submitContactForm = async (formData: ContactFormSchema) => {
  const response = await apiClient.post("/contact", formData);
  return response;
};
