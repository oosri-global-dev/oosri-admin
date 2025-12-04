import Icon, {
  CheckCircleOutlined,
  InfoCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { notification } from "antd";

const useNotification = () => {
  const success = (message) => {
    notification.success({
      message: message,
      icon: (
        <CheckCircleOutlined
          style={{
            color: "green",
          }}
        />
      ),
      style: {
        color: "green",
      },
    });
  };

  const error = (message) => {
    notification.error({
      message: message,
      icon: <StopOutlined />,
    });
  };

  const info = (message) => {
    notification.info({
      message: message,
      icon: (
        <InfoCircleOutlined
          style={{
            color: "#6e9075",
          }}
        />
      ),
    });
  };

  return [success, error, info];
};

export default useNotification;
