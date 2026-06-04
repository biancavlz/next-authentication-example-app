"use server";

import { hashUserPassword } from "@/lib/hash";
import { createUser } from "@/lib/user";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";

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

  try {
    createUser(email, hashedPassword);
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE")
      return { errors: { email: "Email already exists" } };
    throw error;
  }

  redirect("/training");
}

export async function signin(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const errors: Record<string, string> = {};

  if (!email.includes("@")) {
    errors.email = "Please enter a valid email address";
  }

  if (password.trim().length < 1) {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/signin`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      return { errors: { email: "Invalid email or password" } };
    }

    const setCookieHeader = response.headers.get("set-cookie");
    if (!setCookieHeader) {
      return { errors: { email: "Failed to create session" } };
    }
  } catch (error: any) {
    return { errors: { email: "Authentication failed" } };
  }

  redirect("/training");
}

export async function signOutAction() {
  await signOut({ redirect: true, redirectUrl: "/" });
}
