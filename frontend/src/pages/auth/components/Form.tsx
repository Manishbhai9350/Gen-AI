import React from "react";
import { useState } from "react";
import "./scss/form.scss";
import axiosInstance from "../../../utils/axios/axios";
import { Link } from "react-router-dom";

interface FormProps {
  type?: "login" | "signup";
}

const Form = ({ type = "signup" }: FormProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  async function OnSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    if (password !== confirmPass && type == 'signup') {
      return;
    }

    if (type == "signup") {
      const response = await axiosInstance.post("/auth/register", {
        email,
        password,
        username,
      });
      console.log(response);
    } else {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      console.log(response);
    }
  }

  // pass -> cheetah_9350_meow

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2 className="form-title">
          {type === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        <form className="form">
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
            </div>
          )}

          <button type="submit" onClick={OnSubmit} className="submit-btn">
            {type === "login" ? "Login" : "Sign Up"}
          </button>

          <p className="form-footer">
            {type === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <Link to={type == 'signup' ? '/login' : '/signup'}>{type === "login" ? " Sign Up" : " Login"}</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Form;
