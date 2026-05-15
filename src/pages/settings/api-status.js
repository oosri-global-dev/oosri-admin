import Head from "next/head";
import DashboardLayout from "@/components/layouts/DashboardLayout/dashboard-layout";
import ApiStatusScreen from "@/screens/Settings/ApiStatus/api-status";

const ApiStatusPage = () => (
  <>
    <Head><title>API Status | Oosri</title></Head>
    <ApiStatusScreen />
  </>
);

ApiStatusPage.getLayout = (page) => (
  <DashboardLayout title="API Status">{page}</DashboardLayout>
);

export default ApiStatusPage;
