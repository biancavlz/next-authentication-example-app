"use client";

import Link from "next/link";
import { useActionState } from "react";

type FormState = {
  errors?: Record<string, string>;
};

type AuthFormProps = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
  mode: "signup" | "signin";
};

export default function AuthForm({ action, submitLabel, mode }: AuthFormProps) {
  const [state, formAction] = useActionState<FormState, FormData>(action, {});

  return (
    <form id="auth-form" action={formAction}>
      <div>
        <img src="/images/auth-icon.jpg" alt="A lock icon" />
      </div>
      <p>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
      </p>
      <p>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </p>
      {state.errors && Object.keys(state.errors).length > 0 && (
        <ul id="form-errors">
          {Object.keys(state.errors).map((key) => (
            <li key={key}>{state.errors![key]}</li>
          ))}
        </ul>
      )}

      <p>
        <button type="submit">{submitLabel}</button>
      </p>
      <p>
        {mode === "signup" ? (
          <Link href="/login">Login with existing account.</Link>
        ) : (
          <Link href="/">Create a new account.</Link>
        )}
      </p>
    </form>
  );
}
