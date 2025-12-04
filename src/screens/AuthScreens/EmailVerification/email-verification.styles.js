import { FlexibleDiv } from "@/components/lib/Box/styles";
import styled from "styled-components";

export const CheckEmailWrapper = styled(FlexibleDiv)`
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;

  .lock__icon__wrapper {
    background-color: #fedddd40;
    width: fit-content;
    padding: 30px;
    border-radius: 50%;
  }

  .content__wrap {
    .header__text {
      font-size: 1.8rem;
      font-weight: 500;
    }

    .header__sub__text {
      font-size: 0.9rem;
      color: #777;
      text-align: center;
      margin-top: 10px;
    }

    .otp__wrapper {
      gap: 15px;
      margin: 27px 0;

      input {
        padding: 20px;
        font-size: 1.5em;
        border: 1px solid #bbbbbb;
        border-radius: 8px;
      }

      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      input[type="number"] {
        -moz-appearance: textfield;
      }
    }

    .code__text {
      font-size: 0.9rem;

      span {
        color: var(--oosriPrimary);
        cursor: pointer;
      }
    }
  }

  @media (max-width: 650px) {
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;

    .lock__icon__wrapper {
      padding: 20px;

      svg {
        width: 30px;
        height: 30px;
      }
    }

    .content__wrap {
      .otp__wrapper {
        input {
          padding: 14px;
          font-size: 1.2em;
        }
      }
    }
  }

  @media (max-width: 400px) {
    gap: 20px;

    .content__wrap {
      .header__text {
        font-size: 1.4rem;
      }

      .otp__wrapper {
        input {
          padding: 10px;
          font-size: 1.1em;
        }
      }
    }
  }

  @media (max-width: 300px) {
    .content__wrap {
      .otp__wrapper {
        gap: 4px;

        input {
          padding: 8px;
          font-size: 1.1em;
        }
      }
    }
  }
`;
