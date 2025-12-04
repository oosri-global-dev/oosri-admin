import { notification } from "antd";
import { useEffect } from "react";

export default function Notification({ type, message, desc }) {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api.open({
      message: message,
      description:
        desc,
      icon: type === 'success' ? <SmileOutlined style={{ color: "#108ee9" }} /> : <SmileOutlined style={{ color: "#108ee9" }} />,
    });
  };

  useEffect(()=> {
    openNotification()
  }, [type])

  return <> {contextHolder}</>;
}
