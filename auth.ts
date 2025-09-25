import NextAuth, { CredentialsSignin } from "next-auth";
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
                }
              );
              if (!response.ok) {
                return null;
              }
              const parsedResponse = await response.json();
              console.log("Backend login response:", parsedResponse);
              if (!parsedResponse.status) {
                throw new Error(
                  parsedResponse.message || "Invalid credentials!"
                );
                return null;
              }
              return {
                name: parsedResponse.data.name,
                userId: parsedResponse.data.userId,
                role: parsedResponse.data.role,
                accessToken: parsedResponse.data.accessToken,
              };
            } catch (e) {
              throw new CredentialsSignin(
                e instanceof Error ? e.message : "Something went wrong!"
              );
              return null;
            }
          }
          return null;
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
