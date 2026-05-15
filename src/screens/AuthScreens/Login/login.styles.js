import styled from "styled-components";
import BackgroundImage from "@/assets/images/backgroundImg.jpg";

export const LoginPageWrapper = styled.div`
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

  .login__card {
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

  .card__logo {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 28px;

    img {
      height: 36px;
      object-fit: contain;
    }
  }

  .card__heading {
    text-align: center;
    margin-bottom: 28px;

    h1 {
      font-size: 1.35rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 6px;
    }

    p {
      font-size: 0.82rem;
      color: #6b7280;
      margin: 0;
    }
  }

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

  .password__wrapper {
    position: relative;

    input {
      padding-right: 44px;
    }

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

  .forgot__link {
    text-align: right;
    margin-top: -8px;

    span {
      font-size: 0.78rem;
      color: var(--oosriPrimary);
      cursor: pointer;
      font-weight: 500;

      &:hover { text-decoration: underline; }
    }
  }

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
    margin-top: 6px;
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
`;
