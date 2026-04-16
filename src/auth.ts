import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

const isDev = process.env.NODE_ENV === "development";

const providers: NextAuthConfig["providers"] = [];

// Entra ID for production SSO
if (process.env.AZURE_AD_CLIENT_ID) {
  providers.push(
    MicrosoftEntraID({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID || "common"}/v2.0`,
    })
  );
}

// Dev-only credentials provider for local testing
if (isDev) {
  providers.push(
    Credentials({
      name: "Dev Login",
      credentials: {
        alias: { label: "Alias", type: "text", placeholder: "e.g. alexc" },
      },
      async authorize(credentials) {
        if (!credentials?.alias) return null;
        const user = await prisma.user.findUnique({
          where: { alias: credentials.alias as string },
        });
        if (!user) return null;
        return { id: user.id, name: user.displayName, email: `${user.alias}@dev.local` };
      },
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account }) {
      // On first sign-in, resolve the Prisma user ID
      if (user) {
        if (account?.provider === "microsoft-entra-id") {
          // Match by Entra OID or alias from profile
          const dbUser = await prisma.user.findFirst({
            where: { alias: (token.email?.split("@")[0] ?? "").toLowerCase() },
          });
          if (dbUser) token.userId = dbUser.id;
        } else {
          // Dev credentials — user.id is already the Prisma ID
          token.userId = user.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: isDev ? "/auth/dev-login" : undefined,
  },
});
