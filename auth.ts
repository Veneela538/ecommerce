import NextAuth, { CredentialsSignin, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { env } from "./lib/env";
import { getClientHeader } from "./lib/get-headers";
import { LoginFormSchema } from "./schemas/login-form";

export const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials &&
          credentials.hasOwnProperty("username") &&
          credentials.hasOwnProperty("password")
        ) {
          const validatedFields = LoginFormSchema.safeParse(credentials);
          if (validatedFields.success) {
            const { username, password } = validatedFields.data;
            try {
              const clientHeaders = await getClientHeader();
              const response = await fetch(
                `${env.NEXT_PUBLIC_BACKEND_APP_URL}/auth/login`,
                {
                  method: "POST",
                  headers: {
                    ...clientHeaders,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    username,
                    password,
                  }),
                },
              );
              const parsedResponse = await response.json();
              if (!parsedResponse.status) {
                throw new Error(
                  parsedResponse.message || "Invalid credentials!",
                );
                return null;
              }
              return {
                name: parsedResponse.data.name,
                userId: parsedResponse.data.userId,
                role: parsedResponse.data.role,
                accessToken: parsedResponse.data.jwt,
              };
            } catch (e) {
              throw new CredentialsSignin(
                e instanceof Error ? e.message : "Something went wrong!",
              );
              return null;
            }
          }
          return null;
        }

        // google auth

        if (!credentials?.password) {
          const authcode = credentials?.username;
          const response = await fetch(
            `${env.NEXT_PUBLIC_BACKEND_APP_URL}/auth/login-by-code?authcode=${authcode}`,
            { method: "GET", credentials: "include" },
          );
          if (!response.ok) return null;
          const parsedResponse = await response.json();
          if (!parsedResponse.status) return null;

          return {
            name: parsedResponse.data.name,
            userId: parsedResponse.data.userId,
            role: parsedResponse.data.role,
            accessToken: parsedResponse.data.token,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: parseInt(env.AUTH_SESSION_MAX_AGE ?? 600),
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.userId = user.userId;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.userId = token.userId;
        session.user.role = token.role;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
