import { FlexibleDiv } from "@/components/lib/Box/styles";
import styled from "styled-components";

export const LoginWrapper = styled(FlexibleDiv)`
  flex-direction: column;
  gap: 35px;

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

  .login__form {
    display: flex;
    flex-direction: column;
    gap: 25px;
    width: 80%;

    .already__acct {
      font-size: 0.9rem;
      width: 100%;
      text-align: center;

      span {
        text-decoration: underline;
        cursor: pointer;
      }
    }

    .forgot__pass {
      margin-top: 5px;
      font-size: 0.88rem;

      span {
        color: var(--oosriPrimary);
        cursor: pointer;
        font-weight: 500;
      }
    }
  }

  //target only 550px
  @media (max-width: 550px) {
    height: 100dvh;
    justify-content: flex-start;
    padding-top: 80px;

    h1 {
      font-size: 1.6rem;
    }

    .sub__text {
      font-size: 0.9rem;
    }

    .form__parent__wrapper {
      width: 80%;
    }
  }
`;