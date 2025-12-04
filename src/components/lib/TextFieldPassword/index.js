import styled from "styled-components";
import { Input } from "antd";

export default styled(Input.Password)`
  width: ${({ width }) => width || "100%"};
  margin: ${({ margin }) => margin || 0};
  background: ${({ bgColor }) => bgColor || "transparent"};
  height: ${({ height }) => height || "40px"};
  border: ${({ border }) => border || "0.5px solid #E0DED3"};
  border-radius: ${({ borderRadius }) => borderRadius || "8px"};

  &:focus,
  &:focus-within,
  &:hover {
    border-color: var(--orrsiPrimary);
  }
`;
