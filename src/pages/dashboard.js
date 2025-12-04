import DashboardLayout from "@/components/layouts/DashboardLayout/dashboard-layout";
import DashboardScreen from "@/screens/Dashboard/dashboard";
import Head from "next/head";

const DashboardPage = () => {
  return (
    <>
      <Head>
        <title>Dashboard | Oosri</title>
      </Head>
      <DashboardScreen />
    </>
  );
};

DashboardPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default DashboardPage;
