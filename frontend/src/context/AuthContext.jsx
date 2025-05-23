import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest } from "../api/auth";

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

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      setUser( res )
      setIsAuthenticated(true)
    } catch (error) {
      setErrors(error.response?.data?.message || "Registration failed");
    }
  }

  const signin = async (user) => {
    console.log("signin user:", user)
    try {
      const res = await loginRequest(user);
      setUser(res);
      setIsAuthenticated(true);
    } catch (error) {
      console.log("signin error auth",error)
      setErrors(error.response?.data?.message || "Login failed");
    }
  }

  useEffect(() => {
    if (errors) {
      const timer = setTimeout(() => {
        setErrors(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);


  return (
    <AuthContext.Provider value={{signup, signin, user, isAuthenticated, errors, setErrors}}>
      {children}
    </AuthContext.Provider>
  )
}