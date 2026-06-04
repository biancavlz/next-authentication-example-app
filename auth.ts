import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/lib/db";
import { BetterSqliteAdapter } from "@/lib/auth-adapter";

export const authOptions: NextAuthOptions = {
  adapter: BetterSqliteAdapter(db) as any,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const { verifyPassword } = await import("@/lib/hash");
        const stmt = db.prepare("SELECT id, email, password FROM users WHERE email = ?");
        const user = stmt.get(credentials.email) as any;

        if (!user) {
          return null;
        }

        try {
          const isValidPassword = verifyPassword(user.password, credentials.password);
          if (!isValidPassword) {
            return null;
          }
        } catch (error) {
          return null;
        }

        return {
          id: String(user.id),
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        (session.user as any).id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
