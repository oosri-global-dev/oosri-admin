import Head from "next/head";
import DashboardLayout from "@/components/layouts/DashboardLayout/dashboard-layout";
import ShippingProvidersScreen from "@/screens/Settings/ShippingProviders/shipping-providers";

const ShippingProvidersPage = () => (
  <>
    <Head><title>Shipping Providers | Oosri</title></Head>
    <ShippingProvidersScreen />
  </>
);

ShippingProvidersPage.getLayout = (page) => (
  <DashboardLayout title="Shipping Providers">{page}</DashboardLayout>
);

export default ShippingProvidersPage;
