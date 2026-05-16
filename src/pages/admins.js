import DashboardLayout from "@/components/layouts/DashboardLayout/dashboard-layout";
import AdminsScreen from "@/screens/Admins";
import Head from "next/head";

const AdminsPage = () => {
  return (
    <>
      <Head>
        <title>Manage Admins | Oosri</title>
      </Head>
      <AdminsScreen />
    </>
  );
};

AdminsPage.getLayout = (page) => (
  <DashboardLayout title="Manage Admins">{page}</DashboardLayout>
);

export default AdminsPage;
