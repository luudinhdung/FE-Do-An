import { UserType } from "@/types/user";

export interface RegisterType {
  user: UserType;
  accessToken: string;
  refreshToken: string;
}
