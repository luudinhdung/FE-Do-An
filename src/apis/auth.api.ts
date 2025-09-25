import { LoginType } from "@/types/login";
import { RegisterType } from "@/types/register";
import http from "@/utils/http";

const authApi = {
  register: (body: { name: string; email: string; phone: string; password: string }) =>
    http.post("/auth/register", body),
  login: (body: { identifier: string; password: string }) =>
    http.post("/auth/login", body),
};

export default authApi;
