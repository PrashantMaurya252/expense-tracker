"use client"

import axios from "axios";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
}

interface userContextTypes {
  user: User | null;
  token: string;
  isLoggedIn: boolean;
  logout: () => void;
  login: (email: string, password: string) => void;
}

const userContext = createContext<userContextTypes | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined"){
    const localUser = localStorage.getItem("user");
    if (token && localUser) {
      setUser(JSON.parse(localUser));
      setIsLoggedIn(true);
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
  }
  }, [token]);

  useEffect(() => {
    if (typeof window !== "undefined"){
    const verifyToken = async () => {
      const userToken = localStorage.getItem("token");
      if (!userToken) return;
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/me`,
          { headers:{
            Authorization:`Bearer ${userToken}`
          }}
        );
        if(response.data.success){
            setUser(response.data.user)
            setIsLoggedIn(true)
        }else{
            logout()
        }
      } catch (error) {
        console.log("User verification error");
        logout()
      }
    };
  
    verifyToken()
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/email-login`,
        { email, password },{withCredentials:true}
      );
      if (typeof window !== "undefined"){
      if (response.data.success) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.name));
        setToken(response.data.data.token);
        setUser(response.data.data.name);
        setIsLoggedIn(true);
      } else {
        setToken("");
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    return {
      success:response.data.success,
      message:response.data.message
    }
    } catch (error:any) {
      console.log("Login Error", error);
      return {
      success:error.response.data.success || false,
      message:error.response.data.message || error.message || "Login failed"
    }
    }
  };

  const logout = async () => {
    try {
      if (typeof window !== "undefined"){
      setToken("");
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      }
    } catch (error) {
      console.log("logout error", error);
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      token,
      isLoggedIn,
      login,
      logout,
    }),
    [user, token, isLoggedIn]
  );

  return (
    <userContext.Provider value={contextValue}>{children}</userContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(userContext);
  if (!context) throw new Error("useAuth must be inside UserProvider");
  return context;
};
