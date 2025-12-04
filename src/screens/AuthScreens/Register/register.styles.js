import { FlexibleDiv } from "@/components/lib/Box/styles";
import styled from "styled-components";

export const RegisterWrapper = styled(FlexibleDiv)`
  flex-direction: column;
  gap: 35px;
  width: 65%;
  min-height: 100vh;
  height: 100%;
  padding: 35px 0px;

  .header__text {
    font-weight: 500;
  }

  .sub__text {
    color: #555555;
  }

  label {
    font-size: 0.9rem;
    color: #212121;
    font-weight: 500;
  }

  .profile__picture {
    width: 100px;
    height: 100px;
    border: 2px dashed #8d98aa;
    border-radius: 8px;
    margin-top: 10px;
    padding: 10px;
    box-sizing: border-box;
    cursor: pointer;
    position: relative;

    small {
      text-align: center;
      font-size: 0.8rem;
      color: #8d98aa;
    }

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;

      &:hover {
        opacity: 0.5;
      }
    }

    .cancel__icon {
      position: absolute;
      right: 5px;
      top: 5px;
      cursor: pointer;
    }
  }

  .login__form {
    display: flex;
    flex-direction: column;
    gap: 25px;
    width: 100%;
    position: relative;

    .hide__input {
      display: none;
    }

    .already__acct {
      font-size: 0.9rem;
      width: 100%;
      text-align: left;

      span {
        text-decoration: underline;
        cursor: pointer;
      }
    }

    .submit__btn {
      margin-top: 20px;
    }
  }

  .choose__avts {
    text-decoration: underline;
    cursor: pointer;
  }

  @media (max-width: 950px) {
    width: 75%;

    .form__parent__wrapper {
      width: 100%;
    }
  }

  //target only 650px
  @media (max-width: 650px) {
    width: 100%;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 35px 0;
    min-height: 100%;
    height: fit-content;

    .form__parent__wrapper {
      width: 100%;

      .single__row {
        flex-direction: column;
        .half__box {
          width: 100%;
        }
      }
    }
  }

  @media (max-width: 300px) {
    width: 100%;

    .single__row {
      flex-direction: column;
      .half__box {
        width: 100%;
      }
    }
  }
`;
