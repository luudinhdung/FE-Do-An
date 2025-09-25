import { UserType } from "@/types/user";

export interface LoginType {
  user: UserType;
  message: string;
  accessToken: string;
}
