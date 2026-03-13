import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../../utils/axios/axios";
import { useUser } from "../../context/user/user.context";
import type { LoadingVariant } from "../loader/loader";
import Loader from "../loader/loader";

interface AuthenticatedRouteProps {
  children: React.ReactNode;
  variant: LoadingVariant;
}

const AuthenticatedRoute = ({ children, variant }: AuthenticatedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const { setUser } = useUser();

  useEffect(() => {
    let TimeOut;
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
        // TimeOut = setTimeout(() => {
          setLoading(false);
        // },2000)
      }
    };

    checkAuth();

    return () => {
      clearTimeout(TimeOut!)
    } 
  }, []);

  if (loading) {
    return <Loader variant={variant} message="Authenticating User" />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthenticatedRoute;
