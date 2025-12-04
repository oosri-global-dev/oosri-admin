import styled from "styled-components";
import { Button } from "antd";

export default styled(Button)`
  width: ${({ width }) => width || "max-content"};
  width: ${({ maxWidth }) => maxWidth && maxWidth};
  margin: ${({ margin }) => margin};
  height: ${({ height }) => height || "40px"};
  min-height: ${({ height }) => height || "40px"};
  padding: ${({ padding }) => (padding ? padding : "0px 20px")};
  border-color: ${({ borderColor }) => borderColor || "transparent"};
  border: ${({ border }) => border || "1px solid transparent"};
  background: ${({ bg, backgroundColor }) => bg || backgroundColor || "transparent"};
  border-radius: ${({ radius }) => radius || "8px"};
  box-shadow: ${({ boxShadow }) => boxShadow || "none"};
  opacity: ${({ opacity }) => opacity || "1"};
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${({ color }) => color || "var(--oosriBlack)"};
  font-weight: 600;
  font-size: ${({ fontSize }) => fontSize || "13px"};

  &:hover {
    background: ${({ hoverBg }) => hoverBg || "var(--oosriPrimary)"};
    cursor: pointer;
    border-color: ${({ hoverBorderColor }) =>
    hoverBorderColor || "var(--oosriPrimary) !important"};
    color: ${({ hoverColor }) => hoverColor || "var(--oosriWhite)"} !important;
    cursor: pointer !important;
  }

  @media (max-width: 350px) {
    height: ${({ height }) => height === "68px" && "50px"};
  }

  svg {
    font-size: 11px;
    color: inherit;
    margin: 0 0 -2px 4px;
    transition: all 0.3s ease;
    color: ${({ color }) => color || "var(--oosriPrimary)"};
  }

  :focus,
  :active {
    background: ${({ hoverBg }) => hoverBg || "transparent"};
    border-color: ${({ hoverBg, borderColor }) =>
    hoverBg ? hoverBg : borderColor || "var(--oosriPrimary)"};

    span,
    small {
      color: ${({ borderColor }) => borderColor || "var(--oosriPrimary)"};
    }
  }
`;
