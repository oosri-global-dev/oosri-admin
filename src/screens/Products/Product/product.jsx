import { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { useProduct } from '@/hooks/useProduct';
import { getCategories } from '@/network/product';
import ProductDetailsView from './productDetails';
import EditProduct from '../Edit/edit-product';

export default function Product({ productId }) {
  const [edit, setEdit] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const { data, isLoading } = useProduct(productId);
  const product = data?.data?.body;

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

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spin size="large" /></div>;

  return edit
    ? <EditProduct data={product} setEdit={setEdit} subCategories={subCategories} />
    : <ProductDetailsView data={product} onEdit={() => setEdit(true)} />;
}
