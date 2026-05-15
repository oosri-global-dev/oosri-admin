import Head from "next/head";
import DashboardLayout from "@/components/layouts/DashboardLayout/dashboard-layout";
import AllBuyers from "@/screens/Buyers/AllBuyers/all-buyers";

const BuyersPage = () => (
  <>
    <Head><title>Buyers | Oosri</title></Head>
    <AllBuyers />
  </>
);

BuyersPage.getLayout = (page) => (
  <DashboardLayout title="Buyers">{page}</DashboardLayout>
);

export default BuyersPage;
