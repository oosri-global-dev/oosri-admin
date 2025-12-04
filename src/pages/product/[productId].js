import DashboardLayout from "@/components/layouts/DashboardLayout/dashboard-layout";
import Product from "@/screens/Products/Product/product";
import Head from "next/head";
import { useRouter } from "next/router";





export default function ProductPage() {
  const router = useRouter();
  const { productId } = router?.query;
  return (
    <>
      <Head>
        <title>Product Details | Oosri</title>
      </Head>
      <Product productId={productId} />
    </>
  );
}

ProductPage.getLayout = (page) => (
  <DashboardLayout title={"Product Details"} showBackBtn>
    {page}
  </DashboardLayout>
);

