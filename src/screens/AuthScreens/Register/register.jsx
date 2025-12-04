import AuthLayout from "@/components/layouts/AuthLayout/auth-layout";
import { RegisterWrapper } from "./register.styles";
import { FlexibleDiv } from "@/components/lib/Box/styles";
import TextField from "@/components/lib/TextField";
import Button from "@/components/lib/Button";
import { Form } from "antd";
import TextFieldPassword from "@/components/lib/TextFieldPassword";
import useNotification from "@/hooks/useNotification";
import Select from "@/components/lib/Select";
import { BiImageAdd as AddImage } from "react-icons/bi";
import { useRouter } from "next/router";
import { useState } from "react";
import { isValidImageFile } from "@/utils/upload-helper";
import { MdCancel as CancelIcon } from "react-icons/md";
import { handleRegistration } from "@/network/user";
import CustomLoader from "@/components/lib/CustomLoader";
import { countries } from "@/data-helpers/auth-helpers";
import { storeDataInCookie } from "@/data-helpers/auth-session";
import AvatarsModal from "@/components/lib/AvatarsModal";

export default function RegisterPage() {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(undefined);
  const [imageObjectURL, setImageObjectURL] = useState(undefined);
  const [success, error, info] = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [avatarIndex, setAvatarIndex] = useState();
  const [selectedImageGender, setSelectedImageGender] = useState({
    type: "",
    url: "",
  });
  const { push } = useRouter();
  const businessType = [
    { value: "Corporate", label: "Corporate" },
    { value: "Personal", label: "Personal" },
  ];

  const handleMediaChange = (event) => {
    //10mb check
    const maxFileLimit = 10485760;
    let file = event.target.files[0];

    if (!event?.target?.files[0]) {
      error("Please select an image file to continue");
      return;
    }

    if (!isValidImageFile(file.name)) {
      error("Image format must be either PNG, JPG, or JPEG");
      return;
    }

    setImageFile(file);

    if (file.size > maxFileLimit) {
      error("File must be a max of 10mb");
      return;
    }

    //set imageURL object
    setImageObjectURL(URL.createObjectURL(event.target.files[0]));
  };

  const handleSubmitRegistration = async (values) => {
    setIsLoading(true);
    if (!imageObjectURL && !avatarIndex) {
      info("Please upload a profile picture to continue");
      setIsLoading(false);
      return;
    }

    if (!values?.business_type) {
      info("Please select a business type");
      setIsLoading(false);
      return;
    }

    if (!values?.country) {
      info("Please select a country");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();

    //set the formData
    formData.append("firstName", values?.first_name);
    formData.append("lastName", values?.last_name);
    formData.append("email", values?.email);
    formData.append("password", values?.password);
    formData.append("businessType", values?.business_type);
    formData.append("country", values?.country);

    if (avatarIndex) {
      formData.append("profilePicture", `Avatar${avatarIndex}`);
    } else {
      formData.append("profilePicture", imageFile);
    }

    //call api
    try {
      const res = await handleRegistration(formData);
      success(`${res?.data?.message}, redirecting you to the OTP page`);

      setPageLoading(true);
      storeDataInCookie(
        "access_token__admin",
        res?.data?.data?.token || res?.data?.token,
        6
      );

      setTimeout(() => {
        //Store the tokens in cookie
        window.location.href = `/check-email?email=${encodeURIComponent(
          values?.email
        )}`;
      }, 1500);

      //redirect to the OTP page
      setIsLoading(false);
    } catch (err) {
      error(`${err?.response?.data?.message}`);
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      heroText="Join Our Marketplace as a Seller"
      subText="Unlock New Opportunities, Reach More Customers, and Grow Your Business with Us!"
    >
      {pageLoading && <CustomLoader />}
      <AvatarsModal
        open={openModal}
        setOpen={setOpenModal}
        setAvatarIndex={setAvatarIndex}
        avatarIndex={avatarIndex}
      />
      <RegisterWrapper>
        <FlexibleDiv
          justifyContent="flex-start"
          alignItems="flex-start"
          flexDir="column"
          gap="5px"
        >
          <h1 className="header__text">Sign up</h1>
          <p className="sub__text">Empower Your Business, Join Us Today</p>
        </FlexibleDiv>

        <FlexibleDiv
          className="form__parent__wrapper"
          flexDir="column"
          width="100%"
          gap="40px"
        >
          <Form
            form={form}
            onFinish={handleSubmitRegistration}
            className="login__form"
          >
            <FlexibleDiv
              justifyContent="space-between"
              flexWrap="nowrap"
              gap="15px"
              width="100%"
              className="single__row"
            >
              {/* first name */}
              <FlexibleDiv
                flexDir="column"
                alignItems="flex-start"
                width="100%"
                gap="5px"
                className="half__box"
              >
                <label>First Name</label>
                <Form.Item name={"first_name"}>
                  <TextField
                    name="fullName"
                    type="text"
                    maxLength={50}
                    required
                    bgColor="#FAFAFA"
                  />
                </Form.Item>
              </FlexibleDiv>
              {/* last name */}
              <FlexibleDiv
                flexDir="column"
                alignItems="flex-start"
                width="100%"
                gap="5px"
                className="half__box"
              >
                <label>Last Name</label>
                <Form.Item name={"last_name"}>
                  <TextField
                    name="lastName"
                    type="text"
                    maxLength={50}
                    required
                    bgColor="#FAFAFA"
                  />
                </Form.Item>
              </FlexibleDiv>
            </FlexibleDiv>

            <FlexibleDiv
              justifyContent="space-between"
              flexWrap="nowrap"
              gap="15px"
              width="100%"
              className="single__row"
            >
              {/* email */}
              <FlexibleDiv
                flexDir="column"
                alignItems="flex-start"
                width="100%"
                gap="5px"
                className="half__box"
              >
                <label>Email</label>
                <Form.Item name={"email"}>
                  <TextField
                    name="email"
                    type="email"
                    required
                    autoComplete="new-password"
                    bgColor="#FAFAFA"
                  />
                </Form.Item>
              </FlexibleDiv>
              {/* password */}
              <FlexibleDiv
                flexDir="column"
                alignItems="flex-start"
                width="100%"
                gap="5px"
                className="half__box"
              >
                <label>Password</label>
                <Form.Item name={"password"}>
                  <TextFieldPassword
                    name="password"
                    required
                    autoComplete="new-password"
                    bgColor="#FAFAFA"
                  />
                </Form.Item>
              </FlexibleDiv>
            </FlexibleDiv>

            <FlexibleDiv
              justifyContent="space-between"
              flexWrap="nowrap"
              gap="15px"
              width="100%"
              className="single__row"
            >
              {/* business type */}
              <FlexibleDiv
                flexDir="column"
                alignItems="flex-start"
                width="100%"
                gap="5px"
                className="half__box"
              >
                <label>Business Type</label>
                <Form.Item name={"business_type"}>
                  <Select
                    name="businessType"
                    options={businessType}
                    required
                    bgColor="#FAFAFA"
                    height="40px"
                  />
                </Form.Item>
              </FlexibleDiv>

              {/* business type */}
              <FlexibleDiv
                flexDir="column"
                alignItems="flex-start"
                width="100%"
                gap="5px"
                className="half__box"
              >
                <label>Country</label>
                <Form.Item name={"country"}>
                  <Select
                    name="country"
                    required
                    bgColor="#FAFAFA"
                    height="40px"
                    showSearch
                    className="country__select"
                  >
                    {countries.map((cty, idx) => (
                      <Select.Option
                        key={idx}
                        value={cty.name}
                        className="select__public__content"
                      >
                        <img
                          className="small__drop__down__img"
                          src={`https://flagsapi.com/${cty?.code}/flat/64.png`}
                          alt={`${cty?.name?.toLowerCase()}-icon`}
                        />
                        <p>{cty.name}</p>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </FlexibleDiv>
            </FlexibleDiv>

            <FlexibleDiv
              flexDir="row"
              justifyContent="flex-start"
              alignItems="flex-start"
              className="single__row"
            >
              {/* profile picture */}
              <FlexibleDiv
                flexDir="column"
                alignItems="flex-start"
                gap="5px"
                width="50%"
                className="half__box"
              >
                {imageObjectURL || avatarIndex ? (
                  <FlexibleDiv
                    className="profile__picture"
                    flexDir="column"
                    gap="5px"
                  >
                    <img
                      className="h-84"
                      id="blah"
                      src={
                        (avatarIndex &&
                          `https://oosri.com/profile_pictures/Avatar${avatarIndex}.jpg`) ||
                        imageObjectURL ||
                        ""
                      }
                    />
                    <CancelIcon
                      size={22}
                      color="red"
                      className="cancel__icon"
                      onClick={() => {
                        setImageFile("");
                        setImageObjectURL("");
                        setAvatarIndex(null);
                      }}
                    />
                  </FlexibleDiv>
                ) : (
                  <FlexibleDiv
                    flexDir="column"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    gap="10px"
                  >
                    <label htmlFor="addProfileImage">
                      Upload a profile picture
                      <FlexibleDiv
                        className="profile__picture"
                        flexDir="column"
                        gap="5px"
                      >
                        <input
                          hidden
                          type="file"
                          id={"addProfileImage"}
                          name="file"
                          className="hide__input"
                          onChange={handleMediaChange}
                        />
                        <AddImage size={25} color="#8D98AA" />
                        <small>Upload your photo</small>
                      </FlexibleDiv>
                    </label>
                    <FlexibleDiv
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      flexDir="column"
                      gap="4px"
                    >
                      <label
                        className="choose__avts"
                        onClick={() => setOpenModal(true)}
                      >
                        Click here to choose from existing avatars
                      </label>
                    </FlexibleDiv>
                  </FlexibleDiv>
                )}
              </FlexibleDiv>
            </FlexibleDiv>

            <Button
              width="50%"
              radius="8px"
              color="var(--oosriWhite)"
              backgroundColor="var(--oosriPrimary)"
              className="submit__btn"
              loading={isLoading}
              htmlType="submit"
            >
              Create Account
            </Button>

            <p className="already__acct">
              I have account already{" "}
              <span onClick={() => push("/")}>Login here</span>
            </p>
          </Form>
        </FlexibleDiv>
      </RegisterWrapper>
    </AuthLayout>
  );
}
