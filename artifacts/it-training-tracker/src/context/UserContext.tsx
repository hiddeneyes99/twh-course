import React, { createContext, useContext, useState } from "react";
import { setAuthTokenGetter } from "@workspace/api-client-react";

const STORAGE_KEY = "cybertrack_user_id";
const TOKEN_KEY = "cybertrack_token";

interface UserContextType {
  currentMemberId: number | null;
  setCurrentMemberId: (id: number) => void;
  clearCurrentMember: () => void;
  setToken: (token: string) => void;
  ownerName: string;
}

const UserContext = createContext<UserContextType>({
  currentMemberId: null,
  setCurrentMemberId: () => {},
  clearCurrentMember: () => {},
  setToken: () => {},
  ownerName: "Twh",
});

// Register auth token getter once at module load — before any API calls fire.
setAuthTokenGetter(() => localStorage.getItem(TOKEN_KEY));

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentMemberId, setCurrentMemberIdState] = useState<number | null>(() => {
    // Only restore session if we also have a token (both must be present).
    const savedId = localStorage.getItem(STORAGE_KEY);
    const savedToken = localStorage.getItem(TOKEN_KEY);
    return savedId && savedToken ? parseInt(savedId) : null;
  });

  const setCurrentMemberId = (id: number) => {
    setCurrentMemberIdState(id);
    localStorage.setItem(STORAGE_KEY, id.toString());
  };

  const setToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  };

  const clearCurrentMember = () => {
    setCurrentMemberIdState(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  return (
    <UserContext.Provider value={{ currentMemberId, setCurrentMemberId, clearCurrentMember, setToken, ownerName: "Twh" }}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(UserContext);
}
