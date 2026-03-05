/*
 * Component: Flexible/Gridable Boxes
 * Author: Olayinka Aremu
 * Date: 17th October 2023
 * Custom FlexibleDiv and Gridable component
 */

import styled from "styled-components";

/**
 * Custom props consumed by these Box components.
 * These must NOT be forwarded to the DOM — styled-components v6 requires
 * explicit filtering via shouldForwardProp to prevent React warnings.
 */
const CUSTOM_PROPS = new Set([
  'flex', 'flexDir', 'flexWrap', 'justifyContent', 'alignItems',
  'width', 'maxWidth', 'minWidth', 'height', 'minHeight',
  'margin', 'padding', 'bgColor', 'gap', 'border',
  'gridCol', 'gridRow', 'openMenu',
  'position', 'top', 'bottom',
]);

const shouldForwardProp = (prop) => !CUSTOM_PROPS.has(prop);

// Flexible box div element
export const FlexibleDiv = styled("div").withConfig({ shouldForwardProp })`
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
export const FlexibleSection = styled("section").withConfig({ shouldForwardProp })`
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

// Flexible box ul element
export const FlexibleUL = styled("ul").withConfig({ shouldForwardProp })`
  display: flex;
  justify-content: ${({ justifyContent }) => justifyContent || "center"};
  align-items: ${({ alignItems }) => alignItems || "center"};
  flex-wrap: ${({ flexWrap }) => flexWrap || "wrap"};
  flex-direction: ${({ flexDir }) => flexDir || "row"};
  width: ${({ width }) => width || "100%"};
  height: ${({ height }) => height || "max-content"};
  background: ${({ bgColor }) => bgColor || ""};
`;

// Flexible box main element
export const FlexibleMain = styled("main").withConfig({ shouldForwardProp })`
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
export const GridableDiv = styled("div").withConfig({ shouldForwardProp })`
  display: grid;
  grid-template-columns: ${({ gridCol }) => gridCol || "1fr"};
  grid-template-rows: ${({ gridRow }) => gridRow || "auto"};
  grid-gap: ${({ gap }) => gap || "10px"};
`;

// Gridable section element
export const GridSection = styled("section").withConfig({ shouldForwardProp })`
  padding: 50px 0;
  display: grid;
  grid-template-columns: ${({ gridCol }) => gridCol || "1fr  1fr 1fr 1fr"};
  grid-template-rows: ${({ gridRow }) => gridRow || "auto"};
  grid-gap: ${({ gap }) => gap || "10px"};
`;

// Gridable main element
export const GridableMain = styled("main").withConfig({ shouldForwardProp })`
  display: grid;
  grid-template-columns: ${({ gridCol }) => gridCol || "1fr"};
  grid-template-rows: ${({ gridRow }) => gridRow || "auto"};
  grid-gap: ${({ gap }) => gap || "10px"};
`;

// Gridable ul element
export const GridUL = styled("ul").withConfig({ shouldForwardProp })`
  padding: 50px 0;
  display: grid;
  grid-template-columns: ${({ gridCol }) => gridCol || "1fr  1fr 1fr 1fr"};
  grid-template-rows: ${({ gridRow }) => gridRow || "auto"};
  grid-gap: ${({ gap }) => gap || "10px"};
`;
