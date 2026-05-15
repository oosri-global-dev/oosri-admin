import { CheckCircleOutlined, InfoCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { App } from "antd";

const toastStyle = {
  borderRadius: 10,
  boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
  padding: "14px 18px",
};

const useNotification = () => {
  const { notification } = App.useApp();

  const success = (message) => {
    notification.success({
      message: <span style={{ color: "#15803d", fontWeight: 600, fontSize: "0.88rem" }}>{message}</span>,
      icon: <CheckCircleOutlined style={{ color: "#16a34a" }} />,
      style: { ...toastStyle, borderLeft: "4px solid #16a34a", background: "#f0fdf4" },
      duration: 4,
    });
  };

  const error = (message) => {
    notification.error({
      message: <span style={{ color: "#b91c1c", fontWeight: 600, fontSize: "0.88rem" }}>{message || "Something went wrong"}</span>,
      icon: <CloseCircleOutlined style={{ color: "#dc2626" }} />,
      style: { ...toastStyle, borderLeft: "4px solid #dc2626", background: "#fef2f2" },
      duration: 5,
    });
  };

  const info = (message) => {
    notification.info({
      message: <span style={{ color: "#1d4ed8", fontWeight: 600, fontSize: "0.88rem" }}>{message}</span>,
      icon: <InfoCircleOutlined style={{ color: "#2563eb" }} />,
      style: { ...toastStyle, borderLeft: "4px solid #2563eb", background: "#eff6ff" },
      duration: 4,
    });
  };

  return [success, error, info];
};

export default useNotification;
