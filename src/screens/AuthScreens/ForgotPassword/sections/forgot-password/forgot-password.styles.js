import { FlexibleDiv } from "@/components/lib/Box/styles";
import styled from "styled-components";

export const ForgotPasswordWrapper = styled(FlexibleDiv)`
  height: 100%;
  flex-direction: column;
  max-width: 350px;
  gap: 30px;

  .lock__icon__wrapper {
    background-color: #fedddd40;
    width: fit-content;
    padding: 30px;
    border-radius: 50%;
  }

  .header__sub__text {
    font-size: 0.9rem;
    color: #777;
    text-align: center;
  }

  .input__label {
    font-size: 0.9rem;
    margin-bottom: 6px;
  }
`;
