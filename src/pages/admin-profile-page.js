import DashboardLayout from "@/components/layouts/DashboardLayout/dashboard-layout";
import AdminProfile from '@/screens/Profile/admin-profile';

export default function SellerProfileScreen() {
  return <AdminProfile />;
}

SellerProfileScreen.getLayout = (page) => (
  <DashboardLayout title="My Profile">{page}</DashboardLayout>
);
