import React, { useState } from "react";
import "./scss/form.scss";
import axiosInstance from "../../../utils/axios/axios";
import { Link, useNavigate } from "react-router-dom";

interface FormProps {
  type?: "login" | "signup";
}

interface Errors {
  username?: string;
  email?: string;
  password?: string;
  confirmPass?: string;
  server?: string;
}

const Form = ({ type = "signup" }: FormProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const navigate = useNavigate()

  const validate = () => {
    const newErrors: Errors = {};

    if (type === "signup" && !username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    if (type === "signup" && password !== confirmPass) {
      newErrors.confirmPass = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      setErrors({});

      const payload =
        type === "signup"
          ? { email, password, username }
          : { email, password };

      const endpoint = type === "signup" ? "/auth/register" : "/auth/login";

      const response = await axiosInstance.post(endpoint, payload);
      const { data } = response.data;

      if(response.data.success) {
        navigate('/')
      }

      console.log(response.data);
    } catch (err: any) {
      setErrors({
        server:
          err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  // pass -> cheetah_9350_meow

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2 className="form-title">
          <div className="logo">
            <img src="/images/logo.png" />
          </div>
          {type === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        <form className="form" onSubmit={onSubmit}>
          {type === "signup" && (
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                id="username"
                placeholder="Enter username"
              />
              {errors.username && <span className="error">{errors.username}</span>}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              placeholder="Enter email"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              placeholder="Enter password"
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          {type === "signup" && (
            <div className="input-group">
              <label htmlFor="confirm">Confirm Password</label>
              <input
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                type="password"
                id="confirm"
                placeholder="Confirm password"
              />
              {errors.confirmPass && (
                <span className="error">{errors.confirmPass}</span>
              )}
            </div>
          )}

          {errors.server && <div className="server-error">{errors.server}</div>}

          <button disabled={loading} style={{opacity:loading ? .5 : 1}} className="submit-btn">
            {loading
              ? "Loading..."
              : type === "login"
              ? "Login"
              : "Sign Up"}
          </button>

          <p className="form-footer">
            {type === "login"
              ? "Don't have an account?"
              : "Already have an account?"}

            <Link to={type === "signup" ? "/login" : "/signup"}>
              {type === "login" ? " Sign Up" : " Login"}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Form;