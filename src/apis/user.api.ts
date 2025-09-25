import { getUser } from "@/types/getUser";
import http from "@/utils/http";
import axios from "axios";

export const userApi = {
  getUser: () => {
    return http.get<getUser>("/users/current");
  },

  updateUser: (data: { id: string; name: string;phone:string; email: string; avatar: string }) => {
    const { id, ...payload } = data;
    return http.patch(`/users/${id}`, payload); // Chỉ gửi name, email, avatar
  },

  uploadAvatar: (formData: FormData) =>
    axios.post("http://localhost:3002/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  
};
