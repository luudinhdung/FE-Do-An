import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3002", // tùy theo backend của bạn
  withCredentials: true,
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post("/refresh-token", {}, { withCredentials: true });
        const newAccessToken = res.data.accessToken;

        Cookies.set("access_token", newAccessToken, {
          expires: 7,
          secure: true,
          sameSite: "None",
        });

        sessionStorage.setItem("access_token", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        // Nếu refresh token fail, logout luôn
        Cookies.remove("access_token");
        sessionStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
