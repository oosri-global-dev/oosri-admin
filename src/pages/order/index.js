import DashboardLayout from "@/components/layouts/DashboardLayout/dashboard-layout";
import OrderScreen from "@/screens/Order/orders";
import Head from "next/head";

const OrderPage = () => {
  return (
    <>
      <Head>
        <title>Order | Oosri</title>
      </Head>
      <OrderScreen />
    </>
  );
};

OrderPage.getLayout = (page) => (
  <DashboardLayout title={"Order"}>{page}</DashboardLayout>
);

export default OrderPage;
