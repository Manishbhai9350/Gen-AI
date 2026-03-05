import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../../utils/axios/axios";

interface UnAuthenticatedRouteProps {
  children: React.ReactNode;
}

const UnAuthenticatedRoute = ({ children }: UnAuthenticatedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isNotLoggedIn, setIsNotLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/auth/me");

        console.log(res.data.isLoggedIn)

        if (!res.data.isLoggedIn) {
          setIsNotLoggedIn(true);
        } else {
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
