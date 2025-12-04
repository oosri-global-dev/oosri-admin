import DashboardLayout from "@/components/layouts/DashboardLayout/dashboard-layout";
import SaleAnalytics from "@/screens/SaleAnalytics/index";
import Head from "next/head";

const SalesAnalyticsPage = () => {
  return (
    <>
      <Head>
        <title>Sales Analytics | Oosri</title>
      </Head>
      <SaleAnalytics />
    </>
  );
};

SalesAnalyticsPage.getLayout = (page) => (
  <DashboardLayout title={"Sales Analytics"}>{page}</DashboardLayout>
);

export default SalesAnalyticsPage;

