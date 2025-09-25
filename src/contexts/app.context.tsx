"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface AppContextType {
  // Theme
  theme: Theme;
  handleThemeChange: (theme: Theme) => void;

  // Auth
  isAuthenticated: boolean;
  isLoading: boolean;
  handleLogin: (token: string) => void;
  handleLogout: () => void;
}



const initialAppContext: AppContextType = {
  // Theme
  theme: "light",
  handleThemeChange: () => {},

  // Auth
  isAuthenticated: false,
  isLoading: true,
  handleLogin: () => {},
  handleLogout: () => {},

  
};

export const AppContext = createContext<AppContextType>(initialAppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Themes
  const applyTheme = (themeValue: Theme) => {
    if (themeValue === "dark") {
      document.documentElement.classList.add("dark");
    } else if (themeValue === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // "system"
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  useEffect(() => {
    const storedTheme = (localStorage.getItem("theme") as Theme) || "system";
    setTheme(storedTheme);
    applyTheme(storedTheme);

    // Nếu chọn "system" thì tự động đổi theo hệ điều hành
    if (storedTheme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");
      mediaQuery.addEventListener("change", handleChange);

      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // Auth
  useEffect(() => {
    const accessToken = sessionStorage.getItem("access_token");
  
    if (accessToken) {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      // Nếu không có access_token, thử gọi refresh token
      axios.post("/refresh-token", {}, { withCredentials: true }) // cần cấu hình backend cho đúng CORS + cookie
        .then((res) => {
          const newAccessToken = res.data.accessToken;
          Cookies.set("access_token", newAccessToken, {
            expires: 7,
            secure: true,
            sameSite: "None",
          });
          sessionStorage.setItem("access_token", newAccessToken);
          setIsAuthenticated(true);
        })
        .catch(() => {
          setIsAuthenticated(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);
  

  const handleLogin = (accessToken: string) => {
    Cookies.set("access_token", accessToken, {
      expires: 7,
      secure: true,
      sameSite: "None",
    });

    
    sessionStorage.setItem("access_token", accessToken);
    setIsAuthenticated(true);
    router.push("/");
  };

  const handleLogout = () => {
    console.log("Logging out...");
    Cookies.remove("access_token");
    sessionStorage.removeItem("access_token");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AppContext.Provider value={{ theme, handleThemeChange, isAuthenticated, handleLogin, handleLogout, isLoading, }}>
      {children}
     
    </AppContext.Provider>
    
  );
};

export default AppProvider;
