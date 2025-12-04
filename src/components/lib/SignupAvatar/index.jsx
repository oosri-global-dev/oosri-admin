import FemaleAvatar from "@/assets/images/signup/female.jpg";
import MaleAvatar from "@/assets/images/signup/male.jpg";
import { SignupAvatarWrapper } from "./index.styles";

export default function SignupAvatar({ gender, setSelectedObject }) {
  return (
    <SignupAvatarWrapper
      onClick={() => {
        setSelectedObject({
          type: gender.toUpperCase(),
          url: gender === "male" ? MaleAvatar.src : FemaleAvatar.src,
        });
      }}
    >
      {gender === "male" && <img src={MaleAvatar.src} alt="profile" />}
      {gender === "female" && <img src={FemaleAvatar.src} alt="profile" />}
    </SignupAvatarWrapper>
  );
}
