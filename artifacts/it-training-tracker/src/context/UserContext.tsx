import React, { createContext, useContext, useState } from "react";
import { setAuthTokenGetter } from "@workspace/api-client-react";

const STORAGE_KEY = "cybertrack_user_id";
const TOKEN_KEY = "cybertrack_token";

/** Decode JWT payload without verifying signature (server still verifies on every request). */
function decodeToken(token: string): { memberId?: number; isOwner?: boolean } {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return {};
  }
}

interface UserContextType {
  currentMemberId: number | null;
  isOwner: boolean;
  setCurrentMemberId: (id: number) => void;
  clearCurrentMember: () => void;
  setToken: (token: string) => void;
  /** Sets both token + memberId atomically (use after login/switch). */
  applySession: (memberId: number, token: string) => void;
  ownerName: string;
}

const UserContext = createContext<UserContextType>({
  currentMemberId: null,
  isOwner: false,
  setCurrentMemberId: () => {},
  clearCurrentMember: () => {},
  setToken: () => {},
  applySession: () => {},
  ownerName: "Twh",
});

// Register auth token getter once at module load — before any API calls fire.
setAuthTokenGetter(() => localStorage.getItem(TOKEN_KEY));

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentMemberId, setCurrentMemberIdState] = useState<number | null>(() => {
    const savedId = localStorage.getItem(STORAGE_KEY);
    const savedToken = localStorage.getItem(TOKEN_KEY);
    return savedId && savedToken ? parseInt(savedId) : null;
  });

  const [isOwner, setIsOwner] = useState<boolean>(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    return savedToken ? !!decodeToken(savedToken).isOwner : false;
  });

  const setCurrentMemberId = (id: number) => {
    setCurrentMemberIdState(id);
    localStorage.setItem(STORAGE_KEY, id.toString());
  };

  const setToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    setIsOwner(!!decodeToken(token).isOwner);
  };

  const applySession = (memberId: number, token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(STORAGE_KEY, memberId.toString());
    setIsOwner(!!decodeToken(token).isOwner);
    setCurrentMemberIdState(memberId);
  };

  const clearCurrentMember = () => {
    setCurrentMemberIdState(null);
    setIsOwner(false);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  return (
    <UserContext.Provider value={{ currentMemberId, isOwner, setCurrentMemberId, clearCurrentMember, setToken, applySession, ownerName: "Twh" }}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(UserContext);
}
