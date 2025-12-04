import DashboardLayout from '@/components/layouts/DashboardLayout/dashboard-layout';
import { ProductWrapper } from './product.styles';
import { FlexibleDiv } from '@/components/lib/Box/styles';
import HeaderTextAndSub from './simple-components/simple-components';
import ProductImage from '@/assets/images/profile.jpg';
import Button from '@/components/lib/Button';
import { useEffect, useState } from 'react';
import EditProduct from '../Edit/edit-product';
import { getCategories, getProduct } from '@/network/product';
import CustomLoader from '@/components/lib/CustomLoader';
import { ProductDetails } from './productDetails';
import { useProduct } from '@/hooks/useProduct';
import { useRouter } from 'next/router';

export default function Product({ productId }) {
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState();
  const [id, setId] = useState();
  const [subCategories, setSubCategories] = useState();

  // const router = useRouter();
  // const { productId } = router.query;
  const { data, isLoading } = useProduct(productId);
  console.log(data?.data?.body, 'data from product hook');
  // const fetchProductData=async ()=>{
  //   let id = window.location.pathname
  //   let regex = /\/product\/([a-f0-9]{24})/;

  //   let match = id.match(regex);
  //   try{
  //     if (match) {
  //       id = match[1].trim();
  //       console.log("Extracted ID:",id);
  //     } else {
  //       console.log("No ID found.");
  //     }
  //     const data= await getProduct(id)
  //     console.log(data, "data from product details");
  //     setProductData(data?.body)
  //     setId(id)
  //     setLoading(false)
  //   }catch(error){
  //     console.log(error)
  //   }
  // }

  // useEffect(()=>{
  //   fetchProductData()
  // },[])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        const categories = data.data.data;
        const selectedCategory = categories.find(
          (category) => category.name === productData?.category
        );
        if (selectedCategory) {
          const subCategoryOptions = selectedCategory.subcategories?.map(
            (subCategory) => {
              return {
                key: subCategory?.name,
                label: subCategory?.name,
              };
            }
          );
          setSubCategories(subCategoryOptions);
        }
      } catch (errors) {
        console.log(errors);
      }
    };
    fetchCategories();
  }, [productData?.category]);
  return (
    <>
      {isLoading ? (
        <CustomLoader />
      ) : (
          edit ? (
            <div>
              <EditProduct
                data={data?.data?.body}
                id={id}
                setEdit={setEdit}
                subCategories={subCategories}
              />
            </div>
          ) : (
            <ProductWrapper>
              <ProductDetails data={data?.data?.body} setEdit={setEdit} />
            </ProductWrapper>
          )
      )}
    </>
  );
}
