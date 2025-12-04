import DashboardLayout from "@/components/layouts/DashboardLayout/dashboard-layout";
import AllSellers from "@/screens/Sellers/AllSellers/all-sellers";
import Head from "next/head";

const SellersPage = () => {
  return (
    <>
      <Head>
        <title>Sellers | Oosri</title>
      </Head>
      <AllSellers />
    </>
  );
};

SellersPage.getLayout = (page) => (
  <DashboardLayout title={"Sellers"}>{page}</DashboardLayout>
);

export default SellersPage;
