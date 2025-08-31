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
          `${process.env.BACKEND_URI}/api/me`,
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
        `${process.env.BACKEND_URI}/api/login`,
        { email, password }
      );
      if (typeof window !== "undefined"){
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setToken(response.data.token);
        setUser(response.data.user);
        setIsLoggedIn(true);
      } else {
        setToken("");
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    } catch (error) {
      console.log("Login Error", error);
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
