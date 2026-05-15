import { App } from "antd";

const useNotification = () => {
  const { notification } = App.useApp();

  const success = (message) => {
    notification.success({ message, placement: "topRight" });
  };

  const error = (message) => {
    notification.error({ message, placement: "topRight" });
  };

  const info = (message) => {
    notification.info({ message, placement: "topRight" });
  };

  return [success, error, info];
};

export default useNotification;
