import { FlexibleDiv } from "@/components/lib/Box/styles";
import styled from "styled-components";

export const SCWrapper = styled(FlexibleDiv)`
  width: fit-content;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 5px;

  .title {
    font-size: 1.1rem;
    color: black;
    font-weight: 500;
  }

  .sub__text {
    font-size: 1rem;
    color: #555555;
  }
`;
