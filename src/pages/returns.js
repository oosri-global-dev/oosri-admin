import Head from "next/head";
import DashboardLayout from "@/components/layouts/DashboardLayout/dashboard-layout";
import AllReturns from "@/screens/Returns/AllReturns/all-returns";

const ReturnsPage = () => (
  <>
    <Head><title>Returns &amp; Refunds | Oosri</title></Head>
    <AllReturns />
  </>
);

ReturnsPage.getLayout = (page) => (
  <DashboardLayout title="Returns & Refunds">{page}</DashboardLayout>
);

export default ReturnsPage;
