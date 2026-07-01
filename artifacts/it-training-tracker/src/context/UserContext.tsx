import React, { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "cybertrack_user_id";
const OWNER_ID_KEY = "cybertrack_owner_id";

interface UserContextType {
  currentMemberId: number | null;
  setCurrentMemberId: (id: number) => void;
  clearCurrentMember: () => void;
  ownerName: string;
}

const UserContext = createContext<UserContextType>({
  currentMemberId: null,
  setCurrentMemberId: () => {},
  clearCurrentMember: () => {},
  ownerName: "Twh",
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentMemberId, setCurrentMemberIdState] = useState<number | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved) : null;
  });

  const setCurrentMemberId = (id: number) => {
    setCurrentMemberIdState(id);
    localStorage.setItem(STORAGE_KEY, id.toString());
  };

  const clearCurrentMember = () => {
    setCurrentMemberIdState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <UserContext.Provider value={{ currentMemberId, setCurrentMemberId, clearCurrentMember, ownerName: "Twh" }}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(UserContext);
}
