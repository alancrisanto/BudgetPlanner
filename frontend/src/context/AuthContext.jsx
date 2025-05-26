import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest, verifyTokenRequest } from "../api/auth";

export const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [errors, setErrors] = useState(null)

  const signup = async (userData) => {
    try {
      const res = await registerRequest(userData);
      return res;
    } catch (error) {
      setErrors(error.response?.data?.message || "Registration failed");
      throw error;
    }
  }

  const signin = async (userData) => {
    try {
      const res = await loginRequest(userData);
      setUser(res);
      setIsAuthenticated(true);
    } catch (error) {
      console.log("signin error auth",error)
      setErrors(error.response?.data?.message || "Login failed");
    }
  }

  const logout = () => {
  localStorage.removeItem('user');
  setUser(null);
  setIsAuthenticated(false);
};

const checkAuth = async () => {
  const localUser = JSON.parse(localStorage.getItem('user'));
  if (!localUser?.token) return;

  try {
    const res = await verifyTokenRequest(localUser.token);
    if (res.data.valid) {
      setUser(localUser);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("user");
    }
  } catch (error) {
    localStorage.removeItem("user");
    throw error;
  }
};

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (errors) {
      const timer = setTimeout(() => {
        setErrors(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);


  return (
    <AuthContext.Provider value={{signup, signin, logout, user, isAuthenticated, errors, setErrors}}>
      {children}
    </AuthContext.Provider>
  )
}