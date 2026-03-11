import { createContext, useContext, useState, type ReactNode } from "react";
import axiosInstance from "../../utils/axios/axios";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading , setIsLoading ] = useState(false)

  async function refreshUser() {
    try {
      const res = await axiosInstance.get("/auth/me");
      setIsLoading(true)

      if (res.data.isLoggedIn) {
        setUser({
          name: res.data.user.username,
          email: res.data.user.email,
          id: res.data.user.id,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

/* custom hook */
export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }

  return context;
}
