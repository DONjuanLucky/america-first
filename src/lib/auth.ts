import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin";
import { compare, hash } from "bcryptjs";
import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        });

        if (!user) {
          return null;
        }

        const passwordMatches = await compare(parsed.data.password, user.passwordHash);
        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          zip: user.zip,
        };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return true;
      }

      const email = user.email?.toLowerCase();
      if (!email) {
        return false;
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (!existing) {
        const generatedHash = await hash(`google-oauth-${Date.now()}`, 10);
        await prisma.user.create({
          data: {
            email,
            name: user.name ?? "Citizen",
            zip: "00000",
            passwordHash: generatedHash,
            preference: {
              create: {
                trackedIssues: ["Economy", "Healthcare", "Education"],
                trackedReps: [],
                homeModules: ["brief", "queue", "signals"],
                justFacts: true,
              },
            },
          },
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const email = user.email?.toLowerCase();
        if (email) {
          const dbUser = await prisma.user.findUnique({ where: { email } });
          if (dbUser) {
            token.sub = dbUser.id;
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.zip = dbUser.zip;
            token.isAdmin = isAdminEmail(dbUser.email);
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.name = token.name ?? "";
        session.user.email = token.email ?? "";
        session.user.zip = typeof token.zip === "string" ? token.zip : "";
        session.user.isAdmin = Boolean(token.isAdmin);
      }
      return session;
    },
  },
};

export function getAuthSession() {
  return getServerSession(authOptions);
}
