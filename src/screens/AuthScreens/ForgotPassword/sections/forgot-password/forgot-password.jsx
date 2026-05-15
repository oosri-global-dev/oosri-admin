import { useState, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { ForgotPageWrapper } from "./forgot-password.styles";
import { requestPasswordReset, validateResetToken, confirmPasswordReset } from "@/network/user";
import useNotification from "@/hooks/useNotification";
import Logo from "@/assets/images/logo-oosri.png";
import { MdOutlineArrowBack as BackIcon } from "react-icons/md";
import { GoShieldCheck as ShieldIcon } from "react-icons/go";
import { MdLockOutline as LockIcon } from "react-icons/md";
import { MdOutlineMarkEmailRead as EmailIcon } from "react-icons/md";
import { MdCheckCircleOutline as CheckIcon } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function StepIndicator({ step }) {
  return (
    <div className="steps__row">
      {[1, 2, 3].map((n, i) => (
        <div className="step__item" key={n}>
          <div className={`step__circle ${step > n ? "done" : step === n ? "active" : ""}`}>
            {step > n ? <CheckIcon size={14} /> : n}
          </div>
          {i < 2 && <div className={`step__line ${step > n ? "done" : ""}`} />}
        </div>
      ))}
    </div>
  );
}

/* ── Step 1: Email ─────────────────────────────────────── */
function StepEmail({ onNext }) {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();
  const [, error] = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await requestPasswordReset(email.trim());
      onNext(email.trim());
    } catch (err) {
      error(err?.response?.data?.message || "Failed to send reset code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card__heading">
        <div className="step__icon">
          <LockIcon size={22} color="var(--oosriPrimary)" />
        </div>
        <h1>Forgot Password?</h1>
        <p>Enter your admin email address and we'll send you a 4-digit reset code.</p>
      </div>

      <form className="form__fields" onSubmit={handleSubmit}>
        <div className="field__group">
          <label htmlFor="fp-email">Email address</label>
          <input
            id="fp-email"
            className="field__input"
            type="email"
            placeholder="admin@oosri.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <button className="submit__btn" type="submit" disabled={loading}>
          {loading && <span className="btn__spinner" />}
          {loading ? "Sending code…" : "Send Reset Code"}
        </button>
      </form>

      <div className="back__link" onClick={() => push("/")}>
        <BackIcon size={16} />
        Back to login
      </div>
    </>
  );
}

/* ── Step 2: OTP ───────────────────────────────────────── */
function StepOTP({ email, onNext, onBack }) {
  const [otp,     setOtp]     = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [, error] = useNotification();
  const [success] = useNotification();
  const refs = [useRef(), useRef(), useRef(), useRef()];

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 3) refs[idx + 1].current?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) refs[idx - 1].current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 4) { error("Please enter the 4-digit code."); return; }
    setLoading(true);
    try {
      await validateResetToken(email, code);
      onNext(code);
    } catch (err) {
      error(err?.response?.data?.message || "Invalid or expired code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await requestPasswordReset(email);
      success("A new code has been sent to your email.");
    } catch (err) {
      error(err?.response?.data?.message || "Could not resend code.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <div className="card__heading">
        <div className="step__icon">
          <EmailIcon size={22} color="var(--oosriPrimary)" />
        </div>
        <h1>Check Your Email</h1>
        <p>We sent a 4-digit code to<br /><strong>{email}</strong></p>
      </div>

      <form className="form__fields" onSubmit={handleSubmit}>
        <div className="otp__row">
          {otp.map((val, i) => (
            <input
              key={i}
              ref={refs[i]}
              className="otp__box"
              type="number"
              maxLength={1}
              value={val}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>

        <div className="resend__row">
          {resendLoading
            ? "Resending…"
            : <>Didn't receive it? <span onClick={handleResend}>Resend code</span></>
          }
        </div>

        <button className="submit__btn" type="submit" disabled={loading}>
          {loading && <span className="btn__spinner" />}
          {loading ? "Verifying…" : "Verify Code"}
        </button>
      </form>

      <div className="back__link" onClick={onBack}>
        <BackIcon size={16} />
        Use a different email
      </div>
    </>
  );
}

/* ── Step 3: New Password ──────────────────────────────── */
function StepNewPassword({ email, otp, onDone }) {
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [showConf,  setShowConf]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [, error] = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { error("Passwords do not match."); return; }
    if (password.length < 8)  { error("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      await confirmPasswordReset(email, otp, password, confirm);
      onDone();
    } catch (err) {
      error(err?.response?.data?.message || "Failed to reset password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card__heading">
        <div className="step__icon">
          <ShieldIcon size={22} color="var(--oosriPrimary)" />
        </div>
        <h1>Set New Password</h1>
        <p>Must be at least 8 characters with uppercase, lowercase and a number.</p>
      </div>

      <form className="form__fields" onSubmit={handleSubmit}>
        <div className="field__group">
          <label>New password</label>
          <div className="password__wrapper">
            <input
              className="field__input"
              type={showPass ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" className="eye__btn" onClick={() => setShowPass(v => !v)} tabIndex={-1}>
              {showPass ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
            </button>
          </div>
        </div>

        <div className="field__group">
          <label>Confirm password</label>
          <div className="password__wrapper">
            <input
              className="field__input"
              type={showConf ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <button type="button" className="eye__btn" onClick={() => setShowConf(v => !v)} tabIndex={-1}>
              {showConf ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
            </button>
          </div>
        </div>

        <button className="submit__btn" type="submit" disabled={loading}>
          {loading && <span className="btn__spinner" />}
          {loading ? "Saving…" : "Reset Password"}
        </button>
      </form>
    </>
  );
}

/* ── Success screen ────────────────────────────────────── */
function StepSuccess() {
  const { push } = useRouter();
  return (
    <div className="success__box">
      <div className="success__icon">
        <CheckIcon size={28} color="#16a34a" />
      </div>
      <h2>Password Reset!</h2>
      <p>Your password has been updated successfully. You can now sign in with your new password.</p>
      <button className="submit__btn" onClick={() => push("/")}>
        Back to Login
      </button>
    </div>
  );
}

/* ── Root component ────────────────────────────────────── */
export default function ForgotPasswordScreen() {
  const [step,  setStep]  = useState(1);
  const [email, setEmail] = useState("");
  const [otp,   setOtp]   = useState("");

  return (
    <ForgotPageWrapper>
      <div className="forgot__card">
        <div className="card__logo">
          <Image src={Logo} alt="Oosri" height={34} />
        </div>

        {step < 4 && <StepIndicator step={step} />}

        {step === 1 && (
          <StepEmail onNext={(e) => { setEmail(e); setStep(2); }} />
        )}
        {step === 2 && (
          <StepOTP
            email={email}
            onNext={(code) => { setOtp(code); setStep(3); }}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <StepNewPassword email={email} otp={otp} onDone={() => setStep(4)} />
        )}
        {step === 4 && <StepSuccess />}
      </div>
    </ForgotPageWrapper>
  );
}
