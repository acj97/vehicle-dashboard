import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { UserRole } from "@/types";

interface HardcodedUser {
  id: string;
  name: string;
  username: string;
  password: string;
  role: UserRole;
}

const USERS: HardcodedUser[] = [
  { id: "1", name: "Admin", username: "admin", password: "admin123", role: "admin" },
  { id: "2", name: "Viewer", username: "viewer", password: "viewer123", role: "viewer" },
];

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = USERS.find(
          (u) =>
            u.username === credentials?.username &&
            u.password === credentials?.password
        );
        if (!user) return null;
        return { id: user.id, name: user.name, email: user.username, role: user.role };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as { role: UserRole }).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.role = token.role as UserRole;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
