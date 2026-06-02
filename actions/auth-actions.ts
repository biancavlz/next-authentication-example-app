"use server";

import { hashUserPassword } from "@/lib/hash";
import { createUser } from "@/lib/user";

type FormState = {
  errors?: Record<string, string>;
};

export async function signup(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  // User input validation
  const errors: Record<string, string> = {};

  if (!email.includes("@")) {
    errors.email = "Please enter a valid email address";
  }

  if (password.trim().length < 8) {
    errors.password = "Password must be at least 8 characters long";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const hashedPassword = hashUserPassword(password);
  createUser(email, hashedPassword);

  return {};
}
