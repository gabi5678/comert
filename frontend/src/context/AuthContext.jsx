import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const fetchMyProfile = async (idToken) => {
    try {
      const res = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      setProfile(res.data);
    } catch (error) {
      setProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser || null);

      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        setToken(idToken);
        await fetchMyProfile(idToken);
      } else {
        setToken(null);
        setProfile(null);
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async ({ fullName, email, password, phone }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    await updateProfile(firebaseUser, {
      displayName: fullName,
    });

    const idToken = await firebaseUser.getIdToken();

    await api.post(
      "/auth/profile",
      { fullName, phone },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    await fetchMyProfile(idToken);

    return firebaseUser;
  };

  const login = async ({ email, password }) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    await fetchMyProfile(idToken);
    return userCredential.user;
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        profile,
        authLoading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}