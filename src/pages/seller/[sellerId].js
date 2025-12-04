import Seller from "@/screens/Sellers/Seller/seller";
import { useRouter } from "next/router";

export default function SellerPage() {
  const router = useRouter();
  const { sellerId } = router?.query;
  return <Seller sellerId={sellerId} />;
}
