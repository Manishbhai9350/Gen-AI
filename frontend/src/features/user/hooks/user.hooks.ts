import { useState } from "react";
import axiosInstance from "../../../utils/axios/axios";
interface AuthError {
  username?: string;
  email?: string;
  password?: string;
  confirmPass?: string;
  server?: string;
}

interface Callbacks<T = any> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  onFinished?: () => void;
}

interface RegisterProps {
  username: string;
  email: string;
  password: string;
  confirmPass: string;
}

interface LoginProps {
  email: string;
  password: string;
}

export const useUser = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<AuthError>({});

  const register = async (
    { confirmPass, email, password, username }: RegisterProps,
    callbacks?: Callbacks,
  ) => {
    setErrors({});
    setLoading(true);

    try {
      if (!username) {
        setErrors({ username: "Username required" });
        return;
      }

      if (!email) {
        setErrors({ email: "Email required" });
        return;
      }

      if (!password) {
        setErrors({ password: "Password required" });
        return;
      }

      if (password !== confirmPass) {
        setErrors({ confirmPass: "Passwords do not match" });
        return;
      }

      const res = await axiosInstance.post("/auth/register", {
        username,
        email,
        password,
      });

      callbacks?.onSuccess?.(res.data);
    } catch (error: any) {
      const message = error?.response?.data?.message || "Something went wrong";

      setErrors({ server: message });

      callbacks?.onError?.(error);
    } finally {
      setLoading(false);
      callbacks?.onFinished?.();
    }
  };

  const login = async (
    { email, password }: LoginProps,
    callbacks?: Callbacks,
  ) => {
    setErrors({});
    setLoading(true);

    try {
      if (!email) {
        setErrors({ email: "Email required" });
        return;
      }

      if (!password) {
        setErrors({ password: "Password required" });
        return;
      }

      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      callbacks?.onSuccess?.(res.data);
    } catch (error: any) {
      const message = error?.response?.data?.message || "Invalid credentials";

      setErrors({ server: message });

      callbacks?.onError?.(error);
    } finally {
      setLoading(false);
      callbacks?.onFinished?.();
    }
  };

  const logout = async (callbacks?: Callbacks) => {
    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/logout");

      callbacks?.onSuccess?.(res.data);
    } catch (error) {
      callbacks?.onError?.(error);
    } finally {
      setLoading(false);
      callbacks?.onFinished?.();
    }
  };

  return {
    register,
    login,
    logout,
    loading,
    errors,
  };
};
