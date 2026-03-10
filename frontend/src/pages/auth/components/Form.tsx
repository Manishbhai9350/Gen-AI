import React, { useState } from "react";
import "./scss/form.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../features/user/hooks/user.hooks";
import toast from "react-hot-toast";

interface FormProps {
  type?: "login" | "signup";
}

const Form = ({ type = "signup" }: FormProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const navigate = useNavigate();

  const { login, register, loading, errors } = useAuth();

  async function OnSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (type === "signup") {
      register(
        { username, email, password, confirmPass },
        {
          onSuccess: () => {
            toast.success("Signed Up Successfully");
            navigate("/dashboard");
          },
          onError() {
            toast.error("Failed to Signup");
          },
        },
      );
    } else {
      login(
        { email, password },
        {
          onSuccess: () => {
            toast.success("Logged In Successfully");
            navigate("/dashboard");
          },
          onError: () => {
            toast.error("Failed to Login");
          },
          onFinished: () => {
            console.log("Request finished");
          },
        },
      );
    }
  }
  // pass -> cheetah_9350

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2 className="form-title">
          <div className="logo">
            <img src="/images/logo.png" />
          </div>
          {type === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        <form className="form" onSubmit={OnSubmit}>
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
              {errors.username && (
                <span className="error">{errors.username}</span>
              )}
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
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
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

          <button
            disabled={loading}
            style={{ opacity: loading ? 0.5 : 1 }}
            className="submit-btn"
          >
            {loading ? "Loading..." : type === "login" ? "Login" : "Sign Up"}
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
