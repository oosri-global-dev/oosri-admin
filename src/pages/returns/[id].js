import Head from "next/head";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/layouts/DashboardLayout/dashboard-layout";
import ReturnDetail from "@/screens/Returns/ReturnDetail/return-detail";

const ReturnDetailPage = () => {
  const { query } = useRouter();
  return (
    <>
      <Head><title>Return Detail | Oosri</title></Head>
      {query.id && <ReturnDetail id={query.id} />}
    </>
  );
};

ReturnDetailPage.getLayout = (page) => (
  <DashboardLayout title="Return Detail" showBackBtn>{page}</DashboardLayout>
);

export default ReturnDetailPage;
