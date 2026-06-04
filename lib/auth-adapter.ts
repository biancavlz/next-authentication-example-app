import type { Adapter } from "next-auth/adapters";
import type Database from "better-sqlite3";

export function BetterSqliteAdapter(db: Database.Database): Adapter {
  return {
    async createUser(user) {
      const stmt = db.prepare(
        "INSERT INTO users (email) VALUES (?)",
      );
      const result = stmt.run(user.email);
      return {
        id: String(result.lastInsertRowid),
        email: user.email,
        emailVerified: null,
      };
    },

    async getUser(id) {
      const stmt = db.prepare("SELECT id, email FROM users WHERE id = ?");
      const user = stmt.get(id) as any;
      return user
        ? { id: String(user.id), email: user.email, emailVerified: null }
        : null;
    },

    async getUserByEmail(email) {
      const stmt = db.prepare("SELECT id, email FROM users WHERE email = ?");
      const user = stmt.get(email) as any;
      return user
        ? { id: String(user.id), email: user.email, emailVerified: null }
        : null;
    },

    async updateUser(user) {
      if (user.id) {
        const stmt = db.prepare("UPDATE users SET email = ? WHERE id = ?");
        stmt.run(user.email, user.id);
      }
      return user as any;
    },

    async deleteUser(id) {
      const stmt = db.prepare("DELETE FROM users WHERE id = ?");
      stmt.run(id);
    },

    async linkAccount() {
      // Not needed for credentials provider
    },

    async unlinkAccount() {
      // Not needed for credentials provider
    },

    async getAccount() {
      return null;
    },

    async getUserByAccount() {
      return null;
    },

    async createSession(session) {
      const stmt = db.prepare(
        "INSERT INTO sessions (id, expires_at, user_id) VALUES (?, ?, ?)",
      );
      stmt.run(
        session.sessionToken,
        Math.floor(session.expires.getTime() / 1000),
        session.userId,
      );
      return session;
    },

    async getSessionAndUser(sessionToken) {
      const stmt = db.prepare(
        "SELECT s.id, s.expires_at, s.user_id, u.email FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.id = ?",
      );
      const row = stmt.get(sessionToken) as any;
      if (!row) return null;

      return {
        session: {
          sessionToken: row.id,
          userId: String(row.user_id),
          expires: new Date(row.expires_at * 1000),
        },
        user: {
          id: String(row.user_id),
          email: row.email,
          emailVerified: null,
        },
      };
    },

    async updateSession(session) {
      const stmt = db.prepare(
        "UPDATE sessions SET expires_at = ? WHERE id = ?",
      );
      stmt.run(
        Math.floor(session.expires.getTime() / 1000),
        session.sessionToken,
      );
      return session;
    },

    async deleteSession(sessionToken) {
      const stmt = db.prepare("DELETE FROM sessions WHERE id = ?");
      stmt.run(sessionToken);
    },

    async createVerificationToken() {
      return null;
    },

    async useVerificationToken() {
      return null;
    },
  };
}
