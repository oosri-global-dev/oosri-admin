import { useState, useEffect } from 'react';
import { Spin, Modal } from 'antd';
import { useProduct } from '@/hooks/useProduct';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, approveProduct } from '@/network/product';
import { useRouter } from 'next/router';
import ProductDetailsView from './productDetails';
import EditProduct from '../Edit/edit-product';
import useNotification from '@/hooks/useNotification';

export default function Product({ productId }) {
  const [edit, setEdit] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const { data, isLoading, refetch } = useProduct(productId);
  const product = data?.data?.body;
  const qc      = useQueryClient();
  const router  = useRouter();
  const [success, error] = useNotification();

  useEffect(() => {
    if (!product?.category) return;
    getCategories().then((res) => {
      const cats = res?.data?.data || [];
      const cat = cats.find((c) => c.name === product.category);
      if (cat) {
        setSubCategories(cat.subcategories?.map((s) => ({ key: s?.name, label: s?.name })) || []);
      }
    }).catch(() => {});
  }, [product?.category]);

  const { mutate: doApprove, isLoading: approving } = useMutation({
    mutationFn: () => approveProduct(productId, 'approve'),
    onSuccess: () => {
      success('Product approved and is now live.');
      refetch();
      qc.invalidateQueries({ queryKey: ['products'] });
    },
    onError: () => error('Failed to approve product.'),
  });

  const { mutate: doReject, isLoading: rejecting } = useMutation({
    mutationFn: () => approveProduct(productId, 'reject'),
    onSuccess: () => {
      success('Product rejected and removed.');
      qc.invalidateQueries({ queryKey: ['products'] });
      router.push('/products');
    },
    onError: () => error('Failed to reject product.'),
  });

  const handleApprove = () => {
    Modal.confirm({
      title: 'Approve this product?',
      content: 'The product will go live on the marketplace and the seller will be notified.',
      okText: 'Approve',
      cancelText: 'Cancel',
      onOk: () => doApprove(),
    });
  };

  const handleReject = () => {
    Modal.confirm({
      title: 'Reject this product?',
      content: 'The product will be permanently removed and the seller will be notified.',
      okText: 'Reject',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => doReject(),
    });
  };

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spin size="large" /></div>;

  return edit
    ? <EditProduct data={product} setEdit={setEdit} subCategories={subCategories} />
    : (
      <ProductDetailsView
        data={product}
        onEdit={() => setEdit(true)}
        onApprove={handleApprove}
        onReject={handleReject}
        approving={approving}
        rejecting={rejecting}
      />
    );
}
