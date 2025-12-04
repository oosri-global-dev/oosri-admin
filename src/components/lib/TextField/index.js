import React from "react";
import styled from "styled-components";
import { Input } from "antd";

const StyledInput = styled(Input)`
  width: ${({ width }) => width || "100%"};
  margin: ${({ margin }) => margin || 0};
  background: ${({ bgColor }) => bgColor || "#FAFAFA"};
  height: ${({ height }) => height || "40px"};
  border: ${({ border }) => border || "0.5px solid #E0DED3"};
  border-radius: ${({ borderRadius }) => borderRadius || "8px"};

  &:focus,
  &:focus-within,
  &:hover {
    border-color: var(--orrsiPrimary);
  }

  /* Remove arrows for number input (Chrome, Safari, Edge) */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  /* Remove arrows for number input (Firefox) */
  &[type="number"] {
    -moz-appearance: textfield;
    -webkit-appearance: none;
    appearance: textfield;
  }
`;

const TextField = React.forwardRef(
  ({ maxLength, type, onChange, ...props }, ref) => {
    // Use text type for number input to enforce maxLength
    const inputType = type === "number" ? "text" : type;

    const handleChange = (e) => {
      let value = e.target.value;
      if (type === "number") {
        // Only allow digits
        value = value.replace(/\D/g, "");
        // Enforce maxLength
        if (maxLength) value = value.slice(0, maxLength);
        e.target.value = value;
      }
      if (onChange) onChange(e);
    };

    // Prevent scroll to change value (not needed for text, but keep for safety)
    const handleWheel = (e) => {
      if (type === "number") {
        e.target.blur();
      }
    };

    return (
      <StyledInput
        ref={ref}
        type={inputType}
        maxLength={maxLength}
        onChange={handleChange}
        onWheel={handleWheel}
        inputMode={type === "number" ? "numeric" : undefined}
        {...props}
      />
    );
  }
);

export default TextField;
