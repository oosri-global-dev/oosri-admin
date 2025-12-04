import DashboardLayout from '@/components/layouts/DashboardLayout/dashboard-layout';
import AllProductsScreen from '@/screens/Products/AllProducts/all-products';
import Head from 'next/head';

const ProductsPage = () => {
  return (
    <>
      <Head>
        <title>Products | Oosri</title>
      </Head>
      <AllProductsScreen />
    </>
  );
};

ProductsPage.getLayout = (page) => (
  <DashboardLayout title="Products">{page}</DashboardLayout>
);

export default ProductsPage;
