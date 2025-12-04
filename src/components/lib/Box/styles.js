/*
 * Component: Flexible/Gridable Boxes
 * Author: Olayinka Aremu
 * Date: 17th October 2023
 *Custom FlexibleDiv and Gridable component
 */

import styled from "styled-components";

// Flexible box  div element
export const FlexibleDiv = styled("div")`
  display: flex;
  flex: ${({ flex }) => flex || ""};
  justify-content: ${({ justifyContent }) => justifyContent || "center"};
  align-items: ${({ alignItems }) => alignItems || "center"};
  flex-wrap: ${({ flexWrap }) => flexWrap || "wrap"};
  flex-direction: ${({ flexDir }) => flexDir || "row"};
  width: ${({ width }) => width || "100%"};
  max-width: ${({ maxWidth }) => maxWidth || "100%"};
  min-width: ${({ minWidth }) => minWidth};
  height: ${({ height }) => height || "max-content"};
  min-height: ${({ minHeight }) => minHeight || "max-content"};
  margin: ${({ margin }) => margin || "0"};
  padding: ${({ padding }) => padding || "0"};
  background: ${({ bgColor }) => bgColor || ""};
  position: ${({ position }) => position || ""};
  top: ${({ top }) => top || ""};
  bottom: ${({ bottom }) => bottom || ""};
  border: ${({ border }) => border || ""};
  gap: ${({ gap }) => gap || "0px"};
`;

// Flexible box section element
export const FlexibleSection = styled("section")`
  display: flex;
  justify-content: ${({ justifyContent }) => justifyContent || "center"};
  align-items: ${({ alignItems }) => alignItems || "center"};
  flex-wrap: ${({ flexWrap }) => flexWrap || "wrap"};
  flex-direction: ${({ flexDir }) => flexDir || "row"};
  width: ${({ width }) => width || "100%"};
  height: ${({ height }) => height || "max-content"};
  background: ${({ bgColor }) => bgColor || ""};
  max-width: ${({ maxWidth }) => maxWidth || "100%"};
`;

// Flexible box section element
export const FlexibleUL = styled("ul")`
  display: flex;
  justify-content: ${({ justifyContent }) => justifyContent || "center"};
  align-items: ${({ alignItems }) => alignItems || "center"};
  flex-wrap: ${({ flexWrap }) => flexWrap || "wrap"};
  flex-direction: ${({ flexDir }) => flexDir || "row"};
  width: ${({ width }) => width || "100%"};
  height: ${({ height }) => height || "max-content"};
  background: ${({ bgColor }) => bgColor || ""};
`;

// Flexible box section element
export const FlexibleMain = styled("main")`
  display: flex;
  justify-content: ${({ justifyContent }) => justifyContent || "center"};
  align-items: ${({ alignItems }) => alignItems || "center"};
  flex-wrap: ${({ flexWrap }) => flexWrap || "wrap"};
  flex-direction: ${({ flexDir }) => flexDir || "row"};
  width: ${({ width }) => width || "100%"};
  height: ${({ height }) => height || "max-content"};
  background: ${({ bgColor }) => bgColor || ""};
`;

// Gridable div element
export const GridableDiv = styled("div")`
  display: grid;
  grid-template-columns: ${({ gridCol }) => gridCol || "1fr"};
  grid-template-rows: ${({ gridRow }) => gridRow || "auto"};
  grid-gap: ${({ gap }) => gap || "10px"};
`;

// Gridable section element
export const GridSection = styled("section")`
  padding: 50px 0;
  display: grid;
  grid-template-columns: ${({ gridCol }) => gridCol || "1fr  1fr 1fr 1fr"};
  grid-template-rows: ${({ gridRow }) => gridRow || "auto"};
  grid-gap: ${({ gap }) => gap || "10px"};
`;

// Gridable main element
export const GridableMain = styled("main")`
  display: grid;
  grid-template-columns: ${({ gridCol }) => gridCol || "1fr"};
  grid-template-rows: ${({ gridRow }) => gridRow || "auto"};
  grid-gap: ${({ gap }) => gap || "10px"};
`;

// Gridable ul element
export const GridUL = styled("ul")`
  padding: 50px 0;
  display: grid;
  grid-template-columns: ${({ gridCol }) => gridCol || "1fr  1fr 1fr 1fr"};
  grid-template-rows: ${({ gridRow }) => gridRow || "auto"};
  grid-gap: ${({ gap }) => gap || "10px"};
`;
