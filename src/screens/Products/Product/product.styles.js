import { FlexibleDiv } from "@/components/lib/Box/styles";
import styled from "styled-components";

export const ProductWrapper = styled(FlexibleDiv)`
  .details__img{
    max-width:200px;
    max-height:200px;
  }

  h5{
    font-size: 16px;
    font-weight: 400;
  }

  label{
    font-size: 20px;
    font-weight: 500;
  }
`;