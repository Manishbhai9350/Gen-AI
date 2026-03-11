import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../../utils/axios/axios";
import { useUser } from "../../context/user/user.context";

interface AuthenticatedRouteProps {
  children: React.ReactNode;
}

const AuthenticatedRoute = ({ children }: AuthenticatedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const { setUser } = useUser();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/auth/me");

        if (res.data.isLoggedIn) {
          setUser({
            name: res.data.user.username,
            email: res.data.user.email,
            id: res.data.user.id,
          });
          setIsLoggedIn(true);
        } else {
          setUser(null)
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthenticatedRoute;
