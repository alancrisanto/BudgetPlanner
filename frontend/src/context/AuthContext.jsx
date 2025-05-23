import { createContext, useState, useContext } from "react";
import { registerRequest } from "../api/auth";

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
      console.log("res data signup",res);
      setUser( res )
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Error during signup:", error);
      setErrors(error.response?.data?.message || "Registration failed");

    }
  }


  return (
    <AuthContext.Provider value={{signup, user, isAuthenticated, errors, setErrors}}>
      {children}
    </AuthContext.Provider>
  )
}