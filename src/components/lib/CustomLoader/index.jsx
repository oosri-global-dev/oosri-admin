import { Spin } from "antd";
import { CustomLoaderWrap } from "./index.styles";

export default function CustomLoader({ customHeight }) {
  return (
    <CustomLoaderWrap customHeight={customHeight}>
      <Spin size="large"  />
    </CustomLoaderWrap>
  );
}
