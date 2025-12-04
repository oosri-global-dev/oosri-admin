import styled from "styled-components";
import { FlexibleDiv } from "../Box/styles";

export const CustomLoaderWrap = styled(FlexibleDiv)`
  height: ${({ customHeight }) => (customHeight ? customHeight : "100vh")};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 99;
`;
