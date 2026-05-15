import Head from "next/head";
import DashboardLayout from "@/components/layouts/DashboardLayout/dashboard-layout";
import PayoutsScreen from "@/screens/Payouts/payouts";

const PayoutsPage = () => (
  <>
    <Head><title>Payouts | Oosri</title></Head>
    <PayoutsScreen />
  </>
);

PayoutsPage.getLayout = (page) => (
  <DashboardLayout title="Payouts">{page}</DashboardLayout>
);

export default PayoutsPage;
