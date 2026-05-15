import DashboardLayout from "@/components/layouts/DashboardLayout/dashboard-layout";
import Seller from "@/screens/Sellers/Seller/seller";
import { useRouter } from "next/router";

export default function SellerPage() {
  const router = useRouter();
  const { sellerId } = router?.query;
  return <Seller sellerId={sellerId} />;
}

SellerPage.getLayout = (page) => (
  <DashboardLayout title="Seller" showBackBtn>{page}</DashboardLayout>
);
