import DashboardLayout from "@/components/layouts/DashboardLayout/dashboard-layout";
import AttributesScreen from "@/screens/Attributes";

export default function AttributesPage() {
  return <AttributesScreen />;
}

AttributesPage.getLayout = (page) => (
  <DashboardLayout title="Product Attributes">{page}</DashboardLayout>
);
