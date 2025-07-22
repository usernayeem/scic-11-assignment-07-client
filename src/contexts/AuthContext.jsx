import React, { createContext, useEffect, useState } from "react";
import app from "../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import axios from "axios";

export const AuthContext = createContext();
const auth = getAuth(app);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Get JWT token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("edu-manage-token");
    if (storedToken) {
      setToken(storedToken);
      // Set default authorization header for axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, []);

  // Create JWT token for authenticated user
  const createJWTToken = async (email) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API}/jwt`, {
        email: email,
      });
      const jwtToken = response.data.token;

      // Store token in localStorage
      localStorage.setItem("edu-manage-token", jwtToken);
      setToken(jwtToken);

      // Set default authorization header for axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;

      return jwtToken;
    } catch (error) {
      throw error;
    }
  };

  // Clear JWT token
  const clearJWTToken = () => {
    localStorage.removeItem("edu-manage-token");
    setToken(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  const registerUser = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Create JWT token after successful registration
      await createJWTToken(email);
      return userCredential;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const Login = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Create JWT token after successful login
      await createJWTToken(email);
      return userCredential;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const provider = new GoogleAuthProvider();

  const googleAuth = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, provider);
      // Create JWT token after successful Google auth
      await createJWTToken(userCredential.user.email);
      return userCredential;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const Logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      // Clear JWT token on logout
      clearJWTToken();
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser);
        if (currentUser && currentUser.email) {
          // If user is logged in but no token exists, create one
          if (!token) {
            try {
              await createJWTToken(currentUser.email);
            } catch (error) {}
          }
        } else if (!currentUser) {
          // If user is logged out, clear token
          clearJWTToken();
        }
        setLoading(false);
      },
      [token]
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const userData = {
    user,
    setUser,
    registerUser,
    Logout,
    Login,
    loading,
    googleAuth,
    auth,
    token,
    createJWTToken,
    clearJWTToken,
  };

  return (
    <AuthContext.Provider value={userData}>{children}</AuthContext.Provider>
  );
};
