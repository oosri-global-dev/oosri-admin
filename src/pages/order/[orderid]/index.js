import DashboardLayout from "@/components/layouts/DashboardLayout/dashboard-layout";
import OrderDetails from '@/screens/Order/OrderDetails';
import { useRouter } from 'next/router';
import { useOrder } from '@/hooks/useOrder';

export default function OrderDetailsPage() {
  const router = useRouter();
  const { orderid } = router?.query;
  const { data, isLoading, error } = useOrder(orderid);
  return (
    <OrderDetails data={data?.data?.body} isLoading={isLoading} error={error} />
  );
}

OrderDetailsPage.getLayout = (page) => (
  <DashboardLayout title="Order Details" showBackBtn>{page}</DashboardLayout>
);
