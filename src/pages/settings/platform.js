import Head from "next/head";
import DashboardLayout from "@/components/layouts/DashboardLayout/dashboard-layout";
import PlatformConfigScreen from "@/screens/Settings/Platform/platform";

const PlatformConfigPage = () => (
  <>
    <Head><title>Platform Config | Oosri</title></Head>
    <PlatformConfigScreen />
  </>
);

PlatformConfigPage.getLayout = (page) => (
  <DashboardLayout title="Platform Config">{page}</DashboardLayout>
);

export default PlatformConfigPage;
