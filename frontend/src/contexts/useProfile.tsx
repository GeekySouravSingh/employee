"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../api/user";

interface UserProfile {
  userProfile: any;
  setUserProfile: any
}

const RootContext = createContext<UserProfile | undefined>(undefined);

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    //We should use redux to avoid unnessary calls
      (async () => {
      try {
        const resp = await getProfile();
        setUserProfile(resp.user)
      } catch (error) {
        
      }
    })();
  },[])

  return (
    <RootContext.Provider value={{ userProfile ,setUserProfile}}>
      {children}
    </RootContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(RootContext);
  if (context === undefined) {
    throw new Error("useRoot must be used within a RootProvider");
  }
  return context;
};
