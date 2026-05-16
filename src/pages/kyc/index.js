import Head from "next/head";
import DashboardLayout from "@/components/layouts/DashboardLayout/dashboard-layout";
import AllKyc from "@/screens/KYC/AllKyc/all-kyc";

const KycPage = () => (
  <>
    <Head><title>Seller KYC | Oosri</title></Head>
    <AllKyc />
  </>
);

KycPage.getLayout = (page) => (
  <DashboardLayout title="Seller KYC">{page}</DashboardLayout>
);

export default KycPage;
