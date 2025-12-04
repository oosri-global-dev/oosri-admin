import { FlexibleDiv } from "@/components/lib/Box/styles";
import { CreateBusinessWrapper } from "./index.styles";
import PersonalBusiness from "./sections/personal-business";
import { useMainContext } from "@/context";
import { useEffect, useState } from "react";
import { isEmpty, isNull } from "lodash";
import { useRouter } from "next/router";
import CustomLoader from "@/components/lib/CustomLoader";
import CorporateBusiness from "./sections/corporate-business";

export default function CreateBusiness() {
  const {
    state: { user },
  } = useMainContext();
  const [userBusinessType, setUserBusinessType] = useState("");
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  if (!user?._id) {
    push("/");
    return;
  }

  // Only proceed if user has a valid business type
  if (user?.businessType === "Personal" || user?.businessType === "Corporate") {
    if (user.businessType === "Corporate") {
      if (isEmpty(user?.corporateBusinessAccount)) {
        setUserBusinessType("Corporate");
        setIsLoading(false);
        return;
      }
      push("/dashboard");
      return;
    }

    // Handle Personal business type
    if (user.businessType === "Personal") {
      if (isEmpty(user?.personalBusinessAccount)) {
        setUserBusinessType("Personal");
        setIsLoading(false);
        return;
      }
      push("/dashboard");
      return;
    }
  }

  setIsLoading(false);
}, [user, push]);


  return (
    <CreateBusinessWrapper>
      {isLoading ? (
        <CustomLoader />
      ) : (
        <>
          <FlexibleDiv className="header__section" flexDir="column" gap="3px">
            <h1>Create Business</h1>
            <span>Empower Your Business, Join Us Today</span>
          </FlexibleDiv>
          {userBusinessType === "Personal" && <PersonalBusiness />}
          {userBusinessType === "Corporate" && <CorporateBusiness />}
        </>
      )}
    </CreateBusinessWrapper>
  );
}
