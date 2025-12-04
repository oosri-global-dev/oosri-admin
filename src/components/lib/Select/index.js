import styled from "styled-components";
import { Select } from "antd";

export default styled(Select)`
  width: ${({ width }) => width || "fit-content"};
  margin: ${({ margin }) => margin};
  height: ${({ height }) => height || "40px"};
  min-height: ${({ height }) => height || "40px"};
  min-width: ${({ minWidth }) => minWidth || "100px"};
  background: ${({ bgColor }) => bgColor || "#FAFAFA"};

  .ant-select-selector {
    border: ${({ border }) => border || "0.5px solid #E0DED3"} !important;
    border-radius: ${({ borderRadius }) => borderRadius || "5px"};
    background: ${({ bgColor }) => bgColor || "#FAFAFA"} !important;
  }
`;
