import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../../utils/axios/axios";
import { useUser } from "../../context/user/user.context";

interface UnAuthenticatedRouteProps {
  children: React.ReactNode;
}

const UnAuthenticatedRoute = ({ children }: UnAuthenticatedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isNotLoggedIn, setIsNotLoggedIn] = useState<boolean | null>(null);

  const { setUser } = useUser();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/auth/me");

        if (!res.data.isLoggedIn) {
          setUser(null);
          setIsNotLoggedIn(true);
        } else {
          setUser({
            name: res.data.user.username,
            email: res.data.user.email,
            id: res.data.user.id,
          });
          setIsNotLoggedIn(false);
        }
      } catch (error) {
        setIsNotLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  if (!isNotLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default UnAuthenticatedRoute;
