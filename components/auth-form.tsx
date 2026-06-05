"use client";

import { signup } from "@/actions/auth-actions";
import Link from "next/link";
import { useActionState } from "react";

type FormState = {
  errors?: Record<string, string>;
};

interface PostFormProps {
  mode: string;
}

export default function AuthForm({ mode }: PostFormProps) {
  const [state, formAction] = useActionState<FormState, FormData>(signup, {});

  return (
    <form id="auth-form" action={formAction}>
      <h1>{mode === "login" ? "Login" : "Signup"}</h1>
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
        <button type="submit">
          {mode === "login" ? "Login" : "Create an Account"}
        </button>
      </p>
      <p>
        {mode === "login" && (
          <Link href="/?mode=signup">Create an account.</Link>
        )}

        {mode === "signup" && (
          <Link href="/?mode=login">Login with existing account</Link>
        )}
      </p>
    </form>
  );
}
