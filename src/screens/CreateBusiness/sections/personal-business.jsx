import TextField from "@/components/lib/TextField";
import { UploadOutlined } from "@ant-design/icons";
import Button from "@/components/lib/Button";
import { Form, Upload, Button as AntdButton, DatePicker, message } from "antd";
import { FlexibleDiv } from "@/components/lib/Box/styles";
import { objectToFormData } from "@/utils/form-data-helper";
import { useState } from "react";
import { handleCreatePersonalBusiness } from "@/network/business";
import useNotification from "@/hooks/useNotification";
import { useRouter } from "next/router";

export default function PersonalBusiness() {
  const [form] = Form.useForm();
  const [loading, setIsLoading] = useState(false);
  const [success, error] = useNotification();
  const { push } = useRouter();
  const [file, setFile] = useState(null);

  const handleCreateBusiness = async (values) => {
    // Here you would typically send the formData to your server
    setIsLoading(true);
    const formData = new FormData();

    // Append simple fields
    formData.append("dateOfBirth", values.dateOfBirth.format("YYYY-MM-DD"));
    formData.append("residentialAddress", values.residentialAddress);

    // Append file if it exists
    if (
      values.countryIdentificationCard &&
      values.countryIdentificationCard.file
    ) {
      formData.append(
        "countryIdentificationCard",
        values.countryIdentificationCard.file.originFileObj
      );
    }

    // Append bank details
    Object.entries(values.bankDetails).forEach(([key, value]) => {
      formData.append(`bankDetails[${key}]`, value);
    });

    try {
      const res = await handleCreatePersonalBusiness(formData);

        window.location.href = "/dashboard";
    } catch (err) {
      setIsLoading(false);
      if (err?.response?.status === 500) {
        error("Internal Server Error, please try again later...");
        return;
      }
      error(err?.response?.data?.message);
    }
  };

  const fileUploadProps = {
    name: "countryIdentificationCard",
    accept: ".pdf,.jpg,.jpeg,.png",
    maxCount: 1,
    beforeUpload: (file) => {
      const isValidType = [
        "application/pdf",
        "image/jpeg",
        "image/png",
      ].includes(file.type);
      if (!isValidType) {
        message.error("You can only upload PDF or Image files!");
      }
      const isLt4M = file.size / 1024 / 1024 < 4;
      if (!isLt4M) {
        message.error("File must be smaller than 4MB!");
      }
      return isValidType && isLt4M;
    },
  };

  return (
    <Form form={form} onFinish={handleCreateBusiness} className="form__wrapper">
      <FlexibleDiv
        flexDir="row"
        justifyContent="space-between"
        width="100%"
        className="single__row"
      >
        <FlexibleDiv
          flexDir="column"
          alignItems="flex-start"
          gap="5px"
          className="single__input__box"
        >
          <label>Date of Birth</label>
          <Form.Item
            name="dateOfBirth"
            rules={[
              { required: true, message: "Please select your date of birth" },
            ]}
          >
            <DatePicker style={{ width: "100%", height: "40px" }} />
          </Form.Item>
        </FlexibleDiv>
        <FlexibleDiv
          flexDir="column"
          alignItems="flex-start"
          gap="5px"
          className="single__input__box"
        >
          <label>Residential Address</label>
          <Form.Item
            name="residentialAddress"
            rules={[
              {
                required: true,
                message: "Please enter your residential address",
              },
            ]}
          >
            <TextField name="residentialAddress" type="text" maxLength={100} />
          </Form.Item>
        </FlexibleDiv>
      </FlexibleDiv>

      <FlexibleDiv
        flexDir="column"
        alignItems="flex-start"
        gap="5px"
        width="100%"
      >
        <label>Country Identification Card</label>
        <Form.Item
          name="countryIdentificationCard"
          rules={[{ required: true, message: "Please upload your ID card" }]}
        >
          <Upload {...fileUploadProps} onChange={(e) => setFile(e)}>
            <AntdButton color="var(--oosriPrimary)" icon={<UploadOutlined />}>
              Upload ID Card
            </AntdButton>
          </Upload>
        </Form.Item>
      </FlexibleDiv>

      <FlexibleDiv
        flexDir="row"
        justifyContent="space-between"
        width="100%"
        className="single__row"
      >
        <FlexibleDiv
          flexDir="column"
          alignItems="flex-start"
          gap="5px"
          className="single__input__box"
        >
          <label>Bank Name</label>
          <Form.Item
            name={["bankDetails", "bank"]}
            rules={[{ required: true, message: "Please enter your bank name" }]}
          >
            <TextField name="bank" type="text" maxLength={50} />
          </Form.Item>
        </FlexibleDiv>
        <FlexibleDiv
          flexDir="column"
          alignItems="flex-start"
          gap="5px"
          className="single__input__box"
        >
          <label>Account Name</label>
          <Form.Item
            name={["bankDetails", "accountName"]}
            rules={[
              { required: true, message: "Please enter your account name" },
            ]}
          >
            <TextField name="accountName" type="text" maxLength={50} />
          </Form.Item>
        </FlexibleDiv>
      </FlexibleDiv>

      <FlexibleDiv flexDir="row" justifyContent="space-between" width="100%">
        <FlexibleDiv
          flexDir="column"
          alignItems="flex-start"
          gap="5px"
          className="single__input__box"
        >
          <label>Account Number</label>
          <Form.Item
            name={["bankDetails", "accountNumber"]}
            rules={[
              { required: true, message: "Please enter your account number" },
            ]}
          >
            <TextField name="accountNumber" type="text" maxLength={20} />
          </Form.Item>
        </FlexibleDiv>
      </FlexibleDiv>

      <Form.Item>
        <Button
          htmlType="submit"
          backgroundColor="var(--oosriPrimary)"
          color="#ffff"
          loading={loading}
        >
          Create Business
        </Button>
      </Form.Item>
    </Form>
  );
}
