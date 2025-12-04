import DashboardLayout from '@/components/layouts/DashboardLayout/dashboard-layout';
import SellerProfile from '@/screens/Profile/admin-profile';
import Head from 'next/head';

const ProfilePage = () => {
  return (
    <>
      <Head>
        <title>Profile | Oosri</title>
      </Head>
      <SellerProfile />
    </>
  );
};

ProfilePage.getLayout = (page) => (
  <DashboardLayout title={'Profile'}>{page}</DashboardLayout>
);

export default ProfilePage;
