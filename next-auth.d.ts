import "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId: number;
    role: "ADMIN" | "CUSTOMER";
    accessToken: string;
  }
}

declare module "next-auth" {
  // Extend the built-in User type
  interface User extends DefaultUser {
    userId: number;
    role: "ADMIN" | "CUSTOMER"; // you can also do: "ADMIN" | "CUSTOMER" | "AGENT"
    accessToken: string;
    name: string;
  }

  // Extend the Session type
  interface Session {
    user: User;
    accessToken: string;
  }
}
