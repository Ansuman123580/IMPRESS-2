import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../Context/StoreContext";
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken, loadCartData } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Login"); // "Login" | "Sign Up"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ input change handler
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ form submit
  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!agreeTerms && currState === "Sign Up") {
      setErrorMsg("Please agree to the terms and conditions.");
      return;
    }

    setLoading(true);
    try {
      const endpoint =
        currState === "Login" ? "/api/user/login" : "/api/user/register";

      const res = await axios.post(`${url}${endpoint}`, form, {
        validateStatus: () => true, // don't auto-throw
        headers: { "Content-Type": "application/json" },
      });

      if (res?.data?.success) {
        const token = res.data.token;
        setToken(token);
        localStorage.setItem("token", token);

        if (typeof loadCartData === "function") {
          await loadCartData(token);
        }

        setShowLogin(false);
      } else {
        setErrorMsg(res?.data?.message || "Request failed. Please try again.");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setErrorMsg(
        err?.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onSubmit} className="login-popup-container">
        {/* Header */}
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="close"
            className="close-icon"
          />
        </div>

        {/* Inputs */}
        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={form.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={form.email}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={form.password}
            type="password"
            placeholder="Password"
            required
          />
        </div>

        {/* Error Message */}
        {errorMsg && <p className="login-popup-error">{errorMsg}</p>}

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : currState === "Sign Up"
            ? "Create account"
            : "Login"}
        </button>

        {/* Terms */}
        {currState === "Sign Up" && (
          <div className="login-popup-condition">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <p>
              By continuing, I agree to the{" "}
              <span className="link">terms of use</span> &{" "}
              <span className="link">privacy policy</span>.
            </p>
          </div>
        )}

        {/* Footer Switch */}
        <div className="login-popup-footer">
          <p>
            {currState === "Login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <span
              className="link"
              onClick={() =>
                setCurrState(currState === "Login" ? "Sign Up" : "Login")
              }
            >
              {currState === "Login" ? " Sign Up" : " Login"}
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPopup;
