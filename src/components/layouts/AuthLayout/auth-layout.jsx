import { FlexibleDiv } from "@/components/lib/Box/styles";
import { AuthLayoutWrapper } from "./auth-layout.styles";

export default function AuthLayout({ children, heroText = '', subText = '' }) {
  return (
    <AuthLayoutWrapper>
      <FlexibleDiv className="left__section" flexDir="column">
        <div className="background__opacity" />
        <FlexibleDiv className="content__wrapper" flexDir="column" gap="14px">
          <h1 className="hero__text">{heroText}</h1>
          <p>{subText}</p>
        </FlexibleDiv>
      </FlexibleDiv>
      <FlexibleDiv className="right__section">{children}</FlexibleDiv>
    </AuthLayoutWrapper>
  );
}