import { FlexibleDiv } from "@/components/lib/Box/styles";
import { SCWrapper } from "./simple-components.styles";

export default function HeaderTextAndSub({ title, content }) {
  return (
    <SCWrapper>
      <p className="title">{title}</p>
      <p className="sub__text">{content}</p>
    </SCWrapper>
  );
}
