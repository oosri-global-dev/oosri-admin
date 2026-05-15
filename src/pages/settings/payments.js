import Head from "next/head";
import DashboardLayout from "@/components/layouts/DashboardLayout/dashboard-layout";
import PaymentGatewaysScreen from "@/screens/Settings/PaymentGateways/payment-gateways";

const PaymentGatewaysPage = () => (
  <>
    <Head><title>Payment Gateways | Oosri</title></Head>
    <PaymentGatewaysScreen />
  </>
);

PaymentGatewaysPage.getLayout = (page) => (
  <DashboardLayout title="Payment Gateways">{page}</DashboardLayout>
);

export default PaymentGatewaysPage;
