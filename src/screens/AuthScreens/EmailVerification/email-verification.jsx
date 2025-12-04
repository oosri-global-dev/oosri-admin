import { FlexibleDiv } from "@/components/lib/Box/styles";
import { CheckEmailWrapper } from "./email-verification.styles";
import { GoLock as LockIcon } from "react-icons/go";
import AuthLayout from "@/components/layouts/AuthLayout/auth-layout";
import OtpInput from "react-otp-input";
import { useEffect, useState } from "react";
import Button from "@/components/lib/Button";
import { useRouter } from "next/router";
import { isEmpty } from "lodash";
import CustomLoader from "@/components/lib/CustomLoader";
import useNotification from "@/hooks/useNotification";
import { handleOTP, handleResendOTP } from "@/network/user";

export default function EmailVerificationScreen() {
  const [otp, setOtp] = useState("");
  const { query } = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [success, error] = useNotification();
  const [btnLoading, setBtnLoading] = useState(false);
  const [resendOtpBtnLoading, setResetOTPBtnLoading] = useState(false);

  const handleSubmitOTP = async () => {
    setBtnLoading(true);
    if (otp?.length < 4) {
      error("OTP cannot be less than 4 characters");
      setBtnLoading(false);
      return;
    }

    await handleOTP({ email: decodeURIComponent(query?.email), code: otp })
      .then((res) => {
        setPageLoading(true);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      })
      .catch((err) => {
        setBtnLoading(false);
        error(err?.response?.data?.message);
      });
  };

  const handleResendOTPClick = async () => {
    setResetOTPBtnLoading(true);

    await handleResendOTP({ email: decodeURIComponent(query?.email) })
      .then((res) => {
        setResetOTPBtnLoading(false);
        success(res?.data?.message);
      })
      .catch((err) => {
        setResetOTPBtnLoading(false);
        error(err?.response?.data?.message);
      });
  };

  useEffect(() => {
    if (!isEmpty(query)) {
      if (query?.email) {
        //email exists
        setPageLoading(false);
      }
    }
  }, [query]);

  return (
    <AuthLayout
      heroText="Manage Your Business Effortlessly"
      subText="Streamline Operations, Maximize Sales"
    >
      {pageLoading && <CustomLoader />}
      <CheckEmailWrapper>
        <FlexibleDiv
          className="lock__icon__wrapper"
          justifyContent="center"
          alignItems="center"
        >
          <LockIcon size={40} color="var(--oosriPrimary)" />
        </FlexibleDiv>
        <FlexibleDiv
          alignItems="center"
          justifyContent="center"
          flexDir="column"
          className="content__wrap"
        >
          <p className="header__text">Check Email</p>
          <p className="header__sub__text">
            We’ve sent a code to {decodeURIComponent(query?.email)}
          </p>
          <OtpInput
            containerStyle="otp__wrapper"
            value={otp}
            onChange={setOtp}
            numInputs={4}
            inputType="number"
            renderSeparator={<span> </span>}
            renderInput={(props) => <input {...props} />}
          />
          <FlexibleDiv
            justifyContent="center"
            alignItems="center"
            flexDir="column"
            gap="28px"
          >
            {resendOtpBtnLoading ? (
              <p className="code__text">Resending new OTP to your email</p>
            ) : (
              <p className="code__text">
                Didn't get a code?{" "}
                <span onClick={() => handleResendOTPClick()}>
                  Click to resend
                </span>
              </p>
            )}

            <Button
              backgroundColor="var(--oosriPrimary)"
              color="#fff"
              width="100%"
              maxWidth="250px"
              loading={btnLoading}
              onClick={() => handleSubmitOTP()}
            >
              Continue
            </Button>
          </FlexibleDiv>
        </FlexibleDiv>
      </CheckEmailWrapper>
    </AuthLayout>
  );
}
