import styled from "styled-components";
import BackgroundImage from "@/assets/images/backgroundImg.jpg";

export const ForgotPageWrapper = styled.div`
  min-height: 100dvh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${BackgroundImage.src});
  background-size: cover;
  background-position: center;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.62);
    z-index: 0;
  }

  .forgot__card {
    position: relative;
    z-index: 1;
    background: #fff;
    border-radius: 16px;
    padding: 40px 44px 48px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);

    @media (max-width: 480px) {
      margin: 24px 16px;
      padding: 32px 24px 40px;
    }
  }

  /* Logo */
  .card__logo {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;

    img {
      height: 34px;
      object-fit: contain;
    }
  }

  /* Step indicator */
  .steps__row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    margin-bottom: 28px;

    .step__item {
      display: flex;
      align-items: center;
      gap: 0;

      .step__circle {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid #e5e7eb;
        background: #fff;
        color: #9ca3af;
        font-size: 0.72rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;

        &.active   { border-color: var(--oosriPrimary); background: var(--oosriPrimary); color: #fff; }
        &.done     { border-color: #16a34a; background: #16a34a; color: #fff; }
      }

      .step__line {
        width: 48px;
        height: 2px;
        background: #e5e7eb;
        transition: background 0.2s;

        &.done { background: #16a34a; }
      }
    }
  }

  /* Heading area */
  .card__heading {
    text-align: center;
    margin-bottom: 28px;

    .step__icon {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: #fef2f2;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 14px;
    }

    h1 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 6px;
    }

    p {
      font-size: 0.82rem;
      color: #6b7280;
      margin: 0;
      line-height: 1.5;
    }
  }

  /* Form fields */
  .form__fields {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .field__group {
    display: flex;
    flex-direction: column;
    gap: 6px;

    label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #374151;
    }
  }

  .field__input {
    width: 100%;
    height: 44px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 0 14px;
    font-size: 0.88rem;
    font-family: inherit;
    color: #111827;
    background: #f9fafb;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;

    &::placeholder { color: #9ca3af; }

    &:focus {
      border-color: var(--oosriPrimary);
      box-shadow: 0 0 0 3px rgba(252, 83, 83, 0.12);
      background: #fff;
    }
  }

  .password__wrapper {
    position: relative;

    input { padding-right: 44px; }

    .eye__btn {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: #9ca3af;
      display: flex;
      align-items: center;
      padding: 0;

      &:hover { color: #374151; }
    }
  }

  /* OTP boxes */
  .otp__row {
    display: flex;
    gap: 10px;
    justify-content: center;

    .otp__box {
      width: 56px;
      height: 56px;
      border: 1.5px solid #e5e7eb;
      border-radius: 10px;
      text-align: center;
      font-size: 1.3rem;
      font-weight: 700;
      font-family: inherit;
      color: #111827;
      background: #f9fafb;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;

      &:focus {
        border-color: var(--oosriPrimary);
        box-shadow: 0 0 0 3px rgba(252, 83, 83, 0.12);
        background: #fff;
      }

      /* hide number spinners */
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button { -webkit-appearance: none; }
      &[type=number] { -moz-appearance: textfield; }
    }
  }

  .resend__row {
    text-align: center;
    font-size: 0.8rem;
    color: #6b7280;

    span {
      color: var(--oosriPrimary);
      font-weight: 600;
      cursor: pointer;

      &:hover { text-decoration: underline; }
    }
  }

  /* Submit button */
  .submit__btn {
    width: 100%;
    height: 46px;
    background: var(--oosriPrimary);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    margin-top: 4px;
    transition: background 0.15s, opacity 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    &:hover:not(:disabled) { background: #e03d3d; }
    &:disabled { opacity: 0.65; cursor: not-allowed; }

    .btn__spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
  }

  /* Back to login link */
  .back__link {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 20px;
    font-size: 0.8rem;
    color: #6b7280;
    cursor: pointer;
    transition: color 0.15s;

    &:hover { color: #111827; }

    svg { flex-shrink: 0; }
  }

  /* Success state */
  .success__box {
    text-align: center;
    padding: 8px 0;

    .success__icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #f0fdf4;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 18px;
    }

    h2 { font-size: 1.2rem; font-weight: 700; color: #111827; margin: 0 0 8px; }
    p  { font-size: 0.84rem; color: #6b7280; line-height: 1.55; margin: 0 0 24px; }
  }
`;
