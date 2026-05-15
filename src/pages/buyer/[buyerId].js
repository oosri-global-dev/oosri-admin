import { useRouter } from "next/router";
import Head from "next/head";
import DashboardLayout from "@/components/layouts/DashboardLayout/dashboard-layout";
import BuyerScreen from "@/screens/Buyers/Buyer/buyer";

export default function BuyerPage() {
  const router = useRouter();
  const { buyerId } = router.query;
  return (
    <>
      <Head><title>Buyer | Oosri</title></Head>
      <BuyerScreen buyerId={buyerId} />
    </>
  );
}

BuyerPage.getLayout = (page) => (
  <DashboardLayout title="Buyer" showBackBtn>{page}</DashboardLayout>
);
