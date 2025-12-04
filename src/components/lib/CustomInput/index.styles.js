import { Input } from "antd";
import styled from "styled-components";

export const CustomInput=styled(Input)`
    width:  ${({ width }) => width || "100%"};
    max-width: ${({ maxWidth }) => maxWidth && maxWidth};
    height: ${({ height }) => height || "40px"};
    padding: ${({ padding }) => (padding ? padding : "10px")};
    color: ${({ color }) => color || "var(--oosriBlack)"};
    background:${({ backgroundColor }) => backgroundColor || "transparent"};
    font-size: ${({ fontSize }) => fontSize || "13px"};
    border-radius: ${({ radius }) => radius || "8px"};
    font-family: "Inter", sans-serif;
    font-weight: 400;

    &:focus,:active,:hover{
      border-color: ${({ hoverBg, borderColor }) =>
      hoverBg ? hoverBg : borderColor || "#BBBBBB"};
      box-shadow:none;
      background:${({ backgroundColor }) => backgroundColor || "transparent"};
    }

    &:hover{
      background:${({ backgroundColor }) => backgroundColor || "transparent"};
       border-color: ${({ hoverBg, borderColor }) =>
      hoverBg ? hoverBg : borderColor || "#BBBBBB"};
    }

  -webkit-appearance: none;
  -moz-appearance: textfield;
  appearance: textfield;
  
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::-moz-appearance: textfield;
`