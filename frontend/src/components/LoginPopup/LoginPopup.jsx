import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../Context/StoreContext';
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken, loadCartData } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();

    if (!agreeTerms) {
      alert("Please agree to the terms and conditions.");
      return;
    }

    setLoading(true);
    try {
      let endpoint = currState === "Login" ? "/api/user/login" : "/api/user/register";

      // IMPORTANT: don't throw on non-2xx; we want to read the message
      const res = await axios.post(`${url}${endpoint}`, data, {
        validateStatus: () => true,
        headers: { "Content-Type": "application/json" },
      });

      if (res?.data?.success) {
        const token = res.data.token;
        setToken(token);
        localStorage.setItem("token", token);

        // load cart data only if function exists
        if (typeof loadCartData === "function") {
          await loadCartData(token);
        }
        setShowLogin(false);
      } else {
        alert(res?.data?.message || "Request failed. Please try again.");
      }
    } catch (err) {
      console.error("Auth error:", err);
      const msg = err?.response?.data?.message || "Something went wrong. Please try again.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="close" />
        </div>

        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : (currState === "Sign Up" ? "Create account" : "Login")}
        </button>

        <div className="login-popup-condition">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
          />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>

        <div className="login-popup-footer">
          <p>
            {currState === "Login" ? "Don't have an account?" : "Already have an account?"}
            <span onClick={() => setCurrState(currState === "Login" ? "Sign Up" : "Login")}>
              {currState === "Login" ? " Sign Up" : " Login"}
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPopup;
