import { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  userId: number;
  name: string;
  role: "AGENT" | "MANAGER" | "CUSTOMER";
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
    accessToken: string;
  }
  // ! FIXME: Not Working
  // interface jwt {
  //   user: ExtendedUser
  // }
}
