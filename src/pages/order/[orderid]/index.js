import OrderDetails from '@/screens/Order/OrderDetails';
import { useRouter } from 'next/router';
import { useOrder } from '@/hooks/useOrder';

export default function OrderDetailsPage() {
  const router = useRouter();
  const { orderid } = router?.query;
  const { data, isLoading, error } = useOrder(orderid);
  console.log('ORDER DETAILS DATA', data);
  return (
    <OrderDetails data={data?.data?.body} isLoading={isLoading} error={error} />
  );
}
