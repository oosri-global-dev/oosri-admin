import { useState } from 'react';
import DOMPurify from 'dompurify';
import { CreateProductPageWrapper } from '../Create/index.styles';
import { FlexibleDiv } from '@/components/lib/Box/styles';
import Button from '@/components/lib/Button';

export function ProductDescription({ html }) {
  const sanitized =
    typeof window !== 'undefined' ? DOMPurify.sanitize(html || '') : '';

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

export const ProductDetails = ({ data, setEdit }) => {
  const [category, setCategory] = useState(data?.category);
  console.log(data, 'data from product details');

  return (
    <CreateProductPageWrapper style={{ width: '100%' }}>
      <FlexibleDiv className="tab__item">
        <FlexibleDiv className="container_wrapper" alignItems="start">
          {/* Left section */}
          <FlexibleDiv
            className="50%"
            flexDir="column"
            alignItems="start"
            gap="24px"
          >
            <FlexibleDiv justifyContent="start" alignItems="start" gap="16px">
              {/* Name */}
              <div className="product__item">
                <label htmlFor="Name">Product Name</label>
                <h5 width={'100%'}>{data?.productName}</h5>
              </div>
            </FlexibleDiv>
            {/* Category */}
            <div className="product__item">
              <label htmlFor="Name">Product Category</label>
              <h5>{data?.subCategory}</h5>
            </div>
            {/* Brand */}
            <div className="product__item">
              <label htmlFor="Name">Brand</label>
              <h5>{data?.brandArtist}</h5>
            </div>
            {/* Product Type */}
            <div className="product__item">
              <label htmlFor="Name">Product Type</label>
              <h5>{data?.productType}</h5>
            </div>
            {/* Regular Price */}
            {data?.previousPrice === data?.regularPrice ? (
              <div className="product__item">
                <label htmlFor="Name">Regular Price(NGN)</label>
                <h5>{data?.regularPrice}</h5>
              </div>
            ) : (
              <div>
                <label htmlFor="Name">Regular Price(NGN)</label>
                <FlexibleDiv
                  justifyContent="start"
                  flexWrap="nowrap"
                  gap="20px"
                >
                  <h5>{data?.regularPrice}</h5>
                  <h5 style={{ textDecoration: 'line-through', color: 'gray' }}>
                    {data?.previousPrice}
                  </h5>
                </FlexibleDiv>
              </div>
            )}
            {/* Sales Price */}
            <div className="product__item">
              <label htmlFor="Name">Sales Price(NGN)</label>
              <h5>{data?.salesPrice}</h5>
            </div>
          </FlexibleDiv>
          {/* right section */}
          <FlexibleDiv
            flexDir="column"
            gap="24px"
            alignItems="start"
            width="100%"
          >
            <FlexibleDiv gap="16px" justifyContent="start">
              {data?.images.map((item) => {
                return <img src={item} key={item} className="details__img" />;
              })}
            </FlexibleDiv>
            {/* Discounts */}
            <div className="product__item">
              <label htmlFor="Name">Dsicounts</label>
              <h5>{data?.discount}</h5>
            </div>
            {/*Product Description*/}
            <div className="product__item">
              <label htmlFor="Name">Product Description</label>
              <ProductDescription html={data?.productDescription} />
            </div>
            {category === 'Sculpture' ? (
              <>
                {/* Weight */}
                <div className="product__item">
                  <label htmlFor="Name">Weight</label>
                  <h5>{data?.weight}</h5>
                </div>
                {/* Width */}
                <div className="product__item">
                  <label htmlFor="Name">Width</label>
                  <h5>{data?.width}</h5>
                </div>
                {/* Height */}
                <div className="product__item">
                  <label htmlFor="Name">Height</label>
                  <h5>{data?.height}</h5>
                </div>
                {/* Technique */}
                <div className="product__item">
                  <label htmlFor="Name">Technique</label>
                  <h5>{data?.technique}</h5>
                </div>
              </>
            ) : category === 'Textiles/Fabrics' ? (
              <>
                {/* Weight */}
                <div className="product__item">
                  <label htmlFor="Name">Weight</label>
                  <h5>{data?.weight}</h5>
                </div>
                {/* Yard */}
                <div className="product__item">
                  <label htmlFor="Name">Yard</label>
                  <h5>{data?.yard}</h5>
                </div>
                {/* Pattern */}
                <div className="product__item">
                  <label htmlFor="Name">Pattern</label>
                  <h5>{data?.pattern}</h5>
                </div>
                {/* FabricType */}
                <div className="product__item">
                  <label htmlFor="Name">Fabric Type</label>
                  <h5>{data?.fabricType}</h5>
                </div>
              </>
            ) : category === 'Pottery' ? (
              <>
                {/* Diameter */}
                <div className="product__item">
                  <label htmlFor="Name">Diameter</label>
                  <h5>{data?.diameter}</h5>
                </div>
                {/* ClayType */}
                <div className="product__item">
                  <label htmlFor="Name">Clay Type</label>
                  <h5>{data?.clayType}</h5>
                </div>
                {/* Height */}
                <div className="product__item">
                  <label htmlFor="Name">Height</label>
                  <h5>{data?.height}</h5>
                </div>
                {/* Glaze */}
                <div className="product__item">
                  <label htmlFor="Name">Glaze</label>
                  <h5>{data?.glaze}</h5>
                </div>
              </>
            ) : category === 'Paintings' ? (
              <>
                {/* Medium */}
                <div className="product__item">
                  <label htmlFor="Name">Medium</label>
                  <h5>{data?.medium}</h5>
                </div>
                {/* Condition */}
                <div className="product__item">
                  <label htmlFor="Name">Condition</label>
                  <h5>{data?.condition}</h5>
                </div>
                {/* Size */}
                <div className="product__item">
                  <label htmlFor="Name">Size</label>
                  <h5>{data?.size}</h5>
                </div>
              </>
            ) : (
              category === 'Jewelry' && (
                <>
                  {/* length */}
                  <div className="product__item">
                    <label htmlFor="Name">Length</label>
                    <h5>{data?.length}</h5>
                  </div>
                  {/* Diameter */}
                  <div className="product__item">
                    <label htmlFor="Name">Diameter</label>
                    <h5>{data?.diameter}</h5>
                  </div>
                  {/* stoneType */}
                  <div className="product__item">
                    <label htmlFor="Name">Stone Type</label>
                    <h5>{data?.stoneType}</h5>
                  </div>
                  {/* Metal type */}
                  <div className="product__item">
                    <label htmlFor="Name">Metal Type</label>
                    <h5>{data?.metalType}</h5>
                  </div>
                </>
              )
            )}
          </FlexibleDiv>
        </FlexibleDiv>
      </FlexibleDiv>
      <FlexibleDiv justifyContent="end" alignItems="start">
        <Button
          className="edit__button"
          onClick={() => {
            setEdit(true);
          }}
        >
          Edit
        </Button>
      </FlexibleDiv>
    </CreateProductPageWrapper>
  );
};
