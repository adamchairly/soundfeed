import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import httpClient from "@/api/HttpClient";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

interface UserContextType {
  userCode: string;
  loading: boolean;
  recoverIdentity: (code: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userCode, setUserCode] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchUserStatus = async () => {
    try {
      const { data } = await httpClient.get<{
        recoveryCode: string;
      }>("/api/User");
      setUserCode(data.recoveryCode);
    } catch (err) {
      console.error("Could not fetch user identity + " + err);
    } finally {
      setLoading(false);
    }
  };

  const recoverIdentity = async (code: string) => {
    try {
      await httpClient.post("/api/User", { recoveryCode: code });
      return true;
    } catch (err) {
      console.error("Recovery failed: " + err);
      toast.error(getApiErrorMessage(err, "Recovery failed"));
      return false;
    }
  };

  useEffect(() => {
    fetchUserStatus();
  }, []);

  return (
    <UserContext.Provider
      value={{
        userCode,
        loading,
        recoverIdentity,
        refreshUser: fetchUserStatus,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
