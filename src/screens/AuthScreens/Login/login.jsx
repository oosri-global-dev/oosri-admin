import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { LoginPageWrapper } from "./login.styles";
import { handleLogin, handleVerifyLoginOTP } from "@/network/user";
import useNotification from "@/hooks/useNotification";
import { MainContext } from "@/context";
import { CURRENT_USER } from "@/context/types";
import { storeDataInCookie } from "@/data-helpers/auth-session";
import { VerifyModal } from "@/components/lib/VerifyModal";
import Logo from "@/assets/images/logo-oosri.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function LoginPage() {
  const { push } = useRouter();
  const [success, error] = useNotification();
  const { dispatch } = useContext(MainContext);

  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [otpOpen,     setOtpOpen]     = useState(false);
  const [otpLoading,  setOtpLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      error("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await handleLogin({ email, password });
      if (res?.data?.status === 200) {
        setOtpOpen(true);
      }
    } catch (err) {
      error(err?.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp) => {
    setOtpLoading(true);
    try {
      const res = await handleVerifyLoginOTP({ email, otp });
      await dispatch({ type: CURRENT_USER, payload: { ...res?.data?.body?.user } });
      storeDataInCookie("access_token__admin",  res?.data?.body?.accessToken,  30);
      storeDataInCookie("refresh_token__admin", res?.data?.body?.refreshToken, 30);
      success("Welcome back!");
      push("/dashboard");
    } catch (err) {
      setOtpLoading(false);
      error(err?.response?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <LoginPageWrapper>
      {otpOpen && (
        <VerifyModal
          isOpen
          onVerify={handleVerifyOTP}
          loadingBtn={otpLoading}
          onClose={() => { setOtpOpen(false); setLoading(false); }}
        />
      )}

      <div className="login__card">
        <div className="card__logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={Logo.src} alt="Oosri" />
        </div>

        <div className="card__heading">
          <h1>Admin Portal</h1>
          <p>Sign in to manage your platform</p>
        </div>

        <form className="form__fields" onSubmit={handleSubmit}>
          <div className="field__group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              className="field__input"
              type="email"
              placeholder="admin@oosri.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="field__group">
            <label htmlFor="password">Password</label>
            <div className="password__wrapper">
              <input
                id="password"
                className="field__input"
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="eye__btn"
                onClick={() => setShowPass((v) => !v)}
                tabIndex={-1}
              >
                {showPass ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
              </button>
            </div>
          </div>

          <div className="forgot__link">
            <span onClick={() => push("/forgot-password")}>Forgot password?</span>
          </div>

          <button className="submit__btn" type="submit" disabled={loading}>
            {loading ? <span className="btn__spinner" /> : null}
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </LoginPageWrapper>
  );
}
