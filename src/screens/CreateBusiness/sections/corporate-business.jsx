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

export default function CorporateBusiness() {
  const [form] = Form.useForm();
  const [loading, setIsLoading] = useState(false);
  const [success, error] = useNotification();
  const { push } = useRouter();
  const [vatFile, setVATFile] = useState(null);
  const [companyCertFile, setCompanyCertFile] = useState(null);

  const handleCreateBusiness = async (values) => {
    // Here you would typically send the formData to your server
    setIsLoading(true);
    const formData = new FormData();

    // Append simple fields
    formData.append("companyName", values?.companyName);
    formData.append("companyAddress", values?.companyAddress);
    formData.append("vatNumber", values?.vatNumber);
    formData.append("companyRegNum", values?.companyRegNum);
    formData.append("paymentMethod", "Transfer");

    // Append bank details
    Object.entries(values.bankDetails).forEach(([key, value]) => {
      formData.append(`bankDetails[${key}]`, value);
    });

    // Append file if it exists
    if (values.vatCertificate && values.vatCertificate.file) {
      formData.append(
        "vatCertificate",
        values.vatCertificate.file.originFileObj
      );
    }

    if (values.companyCertificate && values.companyCertificate.file) {
      formData.append(
        "companyCertificate",
        values.companyCertificate.file.originFileObj
      );
    }


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

  const companyCertificateUploadProps = {
    name: "companyCertificate",
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
      const isLt4M = file.size / 1024 / 1024 < 6;
      if (!isLt4M) {
        message.error("File must be smaller than 6MB!");
      }
      return isValidType && isLt4M;
    },
  };

  const vatCertificateUploadProps = {
    name: "vatCertificate",
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
      const isLt4M = file.size / 1024 / 1024 < 6;
      if (!isLt4M) {
        message.error("File must be smaller than 6MB!");
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
          <label>Company Name</label>
          <Form.Item
            name="companyName"
            rules={[
              { required: true, message: "Please enter the company's name" },
            ]}
          >
            <TextField name="companyName" type="text" maxLength={100} />
          </Form.Item>
        </FlexibleDiv>
        <FlexibleDiv
          flexDir="column"
          alignItems="flex-start"
          gap="5px"
          className="single__input__box"
        >
          <label>Company Address</label>
          <Form.Item
            name="companyAddress"
            rules={[
              {
                required: true,
                message: "Please enter your company's address",
              },
            ]}
          >
            <TextField name="companyAddress" type="text" maxLength={100} />
          </Form.Item>
        </FlexibleDiv>
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
          <label>VAT Number</label>
          <Form.Item
            name="vatNumber"
            rules={[
              { required: true, message: "Please enter your VAT number" },
            ]}
          >
            <TextField name="vatNumber" type="text" maxLength={100} />
          </Form.Item>
        </FlexibleDiv>
        <FlexibleDiv
          flexDir="column"
          alignItems="flex-start"
          gap="5px"
          className="single__input__box"
        >
          <label>Company's Registration Number</label>
          <Form.Item
            name="companyRegNum"
            rules={[
              {
                required: true,
                message: "Please enter your company's registration number",
              },
            ]}
          >
            <TextField name="companyRegNum" type="text" maxLength={100} />
          </Form.Item>
        </FlexibleDiv>
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
          width="100%"
          className="single__input__box"
        >
          <label>VAT Certificate</label>
          <Form.Item
            name="vatCertificate"
            rules={[
              { required: true, message: "Please upload your VAT Certificate" },
            ]}
          >
            <Upload
              {...vatCertificateUploadProps}
              onChange={(e) => setVATFile(e)}
            >
              <AntdButton color="var(--oosriPrimary)" icon={<UploadOutlined />}>
                Upload VAT Certificate
              </AntdButton>
            </Upload>
          </Form.Item>
        </FlexibleDiv>
        <FlexibleDiv
          flexDir="column"
          alignItems="flex-start"
          gap="5px"
          width="100%"
          className="single__input__box"
        >
          <label>Company's Certificate</label>
          <Form.Item
            name="companyCertificate"
            rules={[
              {
                required: true,
                message: "Please upload your Company's Certificate",
              },
            ]}
          >
            <Upload
              {...companyCertificateUploadProps}
              onChange={(e) => setCompanyCertFile(e)}
            >
              <AntdButton color="var(--oosriPrimary)" icon={<UploadOutlined />}>
                Upload Companay's Certificate
              </AntdButton>
            </Upload>
          </Form.Item>
        </FlexibleDiv>
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
