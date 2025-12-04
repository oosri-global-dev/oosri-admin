import { FlexibleDiv } from "@/components/lib/Box/styles";
import styled from "styled-components";

export const CreateBusinessWrapper = styled(FlexibleDiv)`
  width: 100%;
  height: 100%;
  gap: 40px;
  padding: 30px 0;

  .form__wrapper {
    width: 50%;
    margin-top: 20px;
    flex-direction: column;
    display: flex;
    gap: 25px;

    @media (max-width: 768px) {
      width: 100%;
    }

    .single__input__box {
      width: 48%;

      @media (max-width: 768px) {
        width: 100%;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 35px 20px;

    .single__row {
      gap: 25px;
    }

    .header__section {
      text-align: center;
    }
  }
`;
