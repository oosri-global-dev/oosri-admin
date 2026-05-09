import { CreateProductPageWrapper } from '../Create/index.styles';
import { FlexibleDiv } from '@/components/lib/Box/styles';
import Select from '@/components/lib/Select';
import { Input } from 'antd';
import { StyledModal } from '@/components/lib/Modal/index.styles';
import { CustomInput } from '@/components/lib/CustomInput/index.styles';
import { CustomUpload } from '@/components/lib/CustomUpload';
import { useState } from 'react';
import { editProduct } from '@/network/product';
import Button from '@/components/lib/Button';
import CustomLoader from '@/components/lib/CustomLoader';

const { TextArea } = Input;

export default function EditProduct({ data, id, setEdit, subCategories }) {
  const [category, setCategory] = useState(data?.category);
  const [images, setImages] = useState(data?.images);
  const [img1, setImg1] = useState(data?.images[0]);
  const [img2, setImg2] = useState(data?.images[1]);
  const [img3, setImg3] = useState(data?.images[2]);
  const [img4, setImg4] = useState(data?.images[3]);
  const [productName, setProductName] = useState(data?.productName);
  const [productDescription, setProductDescription] = useState(
    data?.productDescription
  );
  const [brandArtist, setBrandArtist] = useState(data?.brandArtist);
  const [discount, setDiscount] = useState(data?.discount);
  const [weight, setWeight] = useState(data?.weight);
  const [country, setCountry] = useState(data?.country);
  const [openModal, setOpenModal] = useState(false);
  const [subCategory, setSubCategory] = useState(data?.subcategory);
  const [productType, setProductType] = useState(data?.productType);
  const [regularPrice, setRegularPrice] = useState(data?.regularPrice);
  const [salesPrice, setSalesPrice] = useState(data?.salesPrice);
  const [width, setWidth] = useState(data?.width);
  const [height, setHeight] = useState(data?.height);
  const [technique, setTechnique] = useState(data?.technique);
  const [length, setLength] = useState(data?.length);
  const [fabricType, setFabricType] = useState(data?.fabricType);
  const [clayType, setClayType] = useState(data?.clayType);
  const [glaze, setGlaze] = useState(data?.glaze);
  const [diameter, setDiameter] = useState(data?.diameter);
  const [pattern, setPattern] = useState(data?.pattern);
  const [stoneType, setStoneType] = useState(data?.stoneType);
  const [metalType, setMetalType] = useState(data?.metalType);
  const [medium, setMedium] = useState(data?.medium);
  const [condition, setCondition] = useState(data?.condition);
  const [size, setSize] = useState(data?.size);
  const [modalError, setModalError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stock, setStock] = useState(data?.inStock);
  const [yard, setYard] = useState(data?.yard);

  const payload = {
    category: category,
    productName: productName,
    productDescription: productDescription,
    brandArtist: brandArtist,
    images: [img1, img2, img3, img4].filter(Boolean),
    country: country,
    subcategory: subCategory?.value,
    salesPrice: salesPrice,
    regularPrice: regularPrice,
    productType: productType,
    inStock: stock,
    ...(category === 'Sculpture' && {
      width: width,
      weight: weight,
      height: height,
      technique: technique,
    }),
    ...(category === 'Jewelry' && {
      length: length,
      diameter: diameter,
      stoneType: stoneType,
      metalType: metalType,
    }),
    ...(category === 'Paintings' && {
      medium: medium,
      condition: condition,
      size: size,
    }),
    ...(category === 'Pottery' && {
      height: height,
      diameter: diameter,
      clayType: clayType,
      glaze: glaze,
    }),
    ...(category === 'Textiles/Fabrics' && {
      length: length,
      weight: weight,
      width: width,
      fabricType: fabricType,
      pattern: pattern,
    }),
  };

  const productTypeItem = [
    { value: 'simple', label: 'Simple' },
    { value: 'variable', label: 'Variable' },
  ];
  const conditionItem = [
    { value: 'New', label: 'New' },
    { value: 'Used', label: 'Used' },
    { value: 'Antique', label: 'Antique' },
  ];

  const handleEdit = async () => {
    setLoading(true);
    try {
      await editProduct(id, payload);
      setLoading(false);
      setOpenModal(true);
    } catch (errors) {
      // edit failure surfaced by modal state
    } finally {
      setLoading(false);
    }
  };

  const closeModal = async () => {
    // await fetchData()
    setEdit(false);
  };

  const handleSalesPrice = (e) => {
    setRegularPrice(e);
    setSalesPrice(e - (e * 5) / 100);
  };

  return (
    <>
      {loading ? (
        <CustomLoader />
      ) : (
        <CreateProductPageWrapper>
          <FlexibleDiv className="tab__item">
            <FlexibleDiv className="container_wrapper" alignItems="start">
              {/* Left section */}
              <FlexibleDiv
                className="50%"
                flexDir="column"
                alignItems="start"
                gap="24px"
              >
                <FlexibleDiv
                  justifyContent="start"
                  alignItems="start"
                  gap="16px"
                >
                  {/* Name */}
                  <div className="product__item">
                    <label htmlFor="Name">Product Name</label>
                    <CustomInput
                      width={'100%'}
                      placeholder="Input product name"
                      backgroundColor="#FAFAFA"
                      value={productName}
                      onChange={(e) => {
                        setProductName(e.target.value);
                      }}
                    />
                    <p>Do not exceed 40 characters while entering name</p>
                  </div>
                </FlexibleDiv>
                {/* Category */}
                <div className="product__item">
                  <label htmlFor="Name">Product Category</label>
                  <Select
                    options={subCategories}
                    value={subCategory}
                    onChange={(e) => {
                      setSubCategory(e);
                    }}
                    backgroundColor="#FAFAFA"
                    width="100%"
                  />
                </div>
                {/* Brand */}
                <div className="product__item">
                  <label htmlFor="Name">Brand</label>
                  <CustomInput
                    placeholder="Select product brand"
                    backgroundColor="#FAFAFA"
                    onChange={(e) => {
                      setBrandArtist(e.target.value);
                    }}
                    value={brandArtist}
                  />
                </div>
                {/* Quantity available */}
                <div className="product__item">
                  <label htmlFor="Name">Quantity Available (Stock)</label>
                  <CustomInput
                    placeholder="Input Product Price"
                    backgroundColor="#FAFAFA"
                    onChange={(e) => {
                      setStock(e.target.value);
                    }}
                    type="number"
                    value={stock}
                  />
                </div>
                {/* Product Type */}
                <div className="product__item">
                  <label htmlFor="Name">Product Type</label>
                  <Select
                    placeholder="Input product display type"
                    backgroundColor="#FAFAFA"
                    options={productTypeItem}
                    onChange={(e) => {
                      setProductType(e);
                    }}
                    width="100%"
                    defaultValue={productType}
                  />
                </div>
                {/* Regular Price */}
                <div className="product__item">
                  <label htmlFor="Name">Regular Price(NGN)</label>
                  <CustomInput
                    placeholder="Input Product Price"
                    backgroundColor="#FAFAFA"
                    type="number"
                    onChange={(e) => {
                      handleSalesPrice(e.target.value);
                    }}
                    value={regularPrice}
                  />
                </div>
                {/* Sales Price */}
                <div className="product__item">
                  <label htmlFor="Name">Sales Price(NGN)</label>
                  <CustomInput
                    placeholder="Input Product Price"
                    backgroundColor="#FAFAFA"
                    onChange={(e) => {
                      setSalesPrice(e.target.value);
                    }}
                    type="number"
                    value={salesPrice}
                    disabled
                  />
                </div>
              </FlexibleDiv>
              {/* right section */}
              <FlexibleDiv
                flexDir="column"
                gap="24px"
                alignItems="start"
                width="100%"
              >
                <FlexibleDiv className="img__upload" justifyContent="start">
                  <CustomUpload
                    editable
                    setFile={setImg1}
                    initialImage={images[0]}
                  />
                  <CustomUpload
                    editable
                    initialImage={images[1]}
                    setFile={setImg2}
                  />
                  <FlexibleDiv
                    flexDir="column"
                    className="column_item"
                    width="fit-content"
                  >
                    <CustomUpload
                      initialImage={images[2]}
                      editable
                      setFile={setImg3}
                    />
                    <CustomUpload
                      initialImage={images[3]}
                      editable
                      setFile={setImg4}
                    />
                  </FlexibleDiv>
                </FlexibleDiv>
                {/*Product Description*/}
                <div className="product__item">
                  <label htmlFor="Name">Product Description</label>
                  <TextArea
                    placeholder="Minimum of 1000 words"
                    width="100%"
                    value={productDescription}
                    onChange={(e) => {
                      setProductDescription(e.target.value);
                    }}
                  />
                </div>
                {category === 'Sculpture' ? (
                  <>
                    {/* Weight */}
                    <div className="product__item">
                      <label htmlFor="Name">Weight</label>
                      <CustomInput
                        placeholder="Input Product Weight"
                        backgroundColor="#FAFAFA"
                        onChange={(e) => {
                          setWeight(e.target.value);
                        }}
                        type="number"
                        value={weight}
                      />
                    </div>
                    {/* Width */}
                    <div className="product__item">
                      <label htmlFor="Name">Width</label>
                      <CustomInput
                        placeholder="Input Product Width"
                        backgroundColor="#FAFAFA"
                        onChange={(e) => {
                          setWidth(e.target.value);
                        }}
                        type="number"
                        value={width}
                      />
                    </div>
                    {/* Height */}
                    <div className="product__item">
                      <label htmlFor="Name">Height</label>
                      <CustomInput
                        placeholder="Input Product Height"
                        backgroundColor="#FAFAFA"
                        onChange={(e) => {
                          setHeight(e.target.value);
                        }}
                        value={height}
                        type="number"
                      />
                    </div>
                    {/* Technique */}
                    <div className="product__item">
                      <label htmlFor="Name">Technique</label>
                      <CustomInput
                        placeholder="Input Product Technique"
                        backgroundColor="#FAFAFA"
                        onChange={(e) => {
                          setTechnique(e.target.value);
                        }}
                        value={technique}
                      />
                    </div>
                  </>
                ) : category === 'Textiles/Fabrics' ? (
                  <>
                    {/* Weight */}
                    <div className="product__item">
                      <label htmlFor="Name">Weight</label>
                      <CustomInput
                        placeholder="Input Product Weight"
                        backgroundColor="#FAFAFA"
                        onChange={(e) => {
                          setWeight(e.target.value);
                        }}
                        type="number"
                        value={weight}
                      />
                    </div>
                    {/* Yard */}
                    <div className="product__item">
                      <label htmlFor="Name">Yard</label>
                      <CustomInput
                        placeholder="Input Product Yard"
                        backgroundColor="#FAFAFA"
                        onChange={(e) => {
                          setYard(e.target.value);
                        }}
                        type="number"
                        value={yard}
                      />
                    </div>
                    {/* Pattern */}
                    <div className="product__item">
                      <label htmlFor="Name">Pattern</label>
                      <CustomInput
                        placeholder="Input Product Pattern"
                        backgroundColor="#FAFAFA"
                        onChange={(e) => {
                          setPattern(e.target.value);
                        }}
                        value={pattern}
                      />
                    </div>
                    {/* FabricType */}
                    <div className="product__item">
                      <label htmlFor="Name">Fabric Type</label>
                      <CustomInput
                        placeholder="Input Product Fabric Type"
                        backgroundColor="#FAFAFA"
                        onChange={(e) => {
                          setFabricType(e.target.value);
                        }}
                        value={fabricType}
                      />
                    </div>
                  </>
                ) : category === 'Pottery' ? (
                  <>
                    {/* Diameter */}
                    <div className="product__item">
                      <label htmlFor="Name">Diameter</label>
                      <CustomInput
                        placeholder="Input Product Diameter"
                        backgroundColor="#FAFAFA"
                        onChange={(e) => {
                          setDiameter(e.target.value);
                        }}
                        type="number"
                        value={diameter}
                      />
                    </div>
                    {/* ClayType */}
                    <div className="product__item">
                      <label htmlFor="Name">Clay Type</label>
                      <CustomInput
                        placeholder="Input Clay Type"
                        backgroundColor="#FAFAFA"
                        onChange={(e) => {
                          setClayType(e.target.value);
                        }}
                        value={clayType}
                      />
                    </div>
                    {/* Height */}
                    <div className="product__item">
                      <label htmlFor="Name">Height</label>
                      <CustomInput
                        placeholder="Input Product Height"
                        backgroundColor="#FAFAFA"
                        value={height}
                        onChange={(e) => {
                          setHeight(e.target.value);
                        }}
                        type="number"
                      />
                    </div>
                    {/* Glaze */}
                    <div className="product__item">
                      <label htmlFor="Name">Glaze</label>
                      <CustomInput
                        placeholder="Input Product Glaze"
                        backgroundColor="#FAFAFA"
                        onChange={(e) => {
                          setGlaze(e.target.value);
                        }}
                        value={glaze}
                      />
                    </div>
                  </>
                ) : category === 'Paintings' ? (
                  <>
                    {/* Medium */}
                    <div className="product__item">
                      <label htmlFor="Name">Medium</label>
                      <CustomInput
                        placeholder="Input Painting Medium"
                        backgroundColor="#FAFAFA"
                        onChange={(e) => {
                          setMedium(e.target.value);
                        }}
                        value={medium}
                      />
                    </div>
                    {/* Condition */}
                    <div className="product__item">
                      <label htmlFor="Name">Condition</label>
                      <Select
                        placeholder="Input Painting Condition"
                        backgroundColor="#FAFAFA"
                        options={conditionItem}
                        value={condition}
                        onChange={(e) => {
                          setCondition(e);
                        }}
                      />
                    </div>
                    {/* Size */}
                    <div className="product__item">
                      <label htmlFor="Name">Size</label>
                      <CustomInput
                        placeholder="Input Painting Size"
                        backgroundColor="#FAFAFA"
                        onChange={(e) => {
                          setSize(e.target.value);
                        }}
                        type="number"
                        value={size}
                      />
                    </div>
                  </>
                ) : (
                  category === 'Jewelry' && (
                    <>
                      {/* length */}
                      <div className="product__item">
                        <label htmlFor="Name">Length</label>
                        <CustomInput
                          placeholder="Input Product Length"
                          backgroundColor="#FAFAFA"
                          onChange={(e) => {
                            setLength(e.target.value);
                          }}
                          type="number"
                          value={length}
                        />
                      </div>
                      {/* Diameter */}
                      <div className="product__item">
                        <label htmlFor="Name">Diameter</label>
                        <CustomInput
                          placeholder="Input Product Diameter"
                          backgroundColor="#FAFAFA"
                          onChange={(e) => {
                            setDiameter(e.target.value);
                          }}
                          type="number"
                          value={diameter}
                        />
                      </div>
                      {/* stoneType */}
                      <div className="product__item">
                        <label htmlFor="Name">Stone Type</label>
                        <CustomInput
                          placeholder="Input Stone Type"
                          backgroundColor="#FAFAFA"
                          onChange={(e) => {
                            setStoneType(e.target.value);
                          }}
                          value={stoneType}
                        />
                      </div>
                      {/* Metal type */}
                      <div className="product__item">
                        <label htmlFor="Name">Metal Type</label>
                        <CustomInput
                          placeholder="Input Metal Type"
                          backgroundColor="#FAFAFA"
                          onChange={(e) => {
                            setMetalType(e.target.value);
                          }}
                          type="number"
                          value={metalType}
                        />
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
                handleEdit();
              }}
            >
              Save Changes
            </Button>
          </FlexibleDiv>

          <StyledModal
            maskClosable={true}
            open={openModal}
            centered
            closeIcon={null}
            className="modal"
            footer={null}
          >
            {modalError ? (
              <>
                <h2 style={{ textAlign: 'center' }}>Product Update Failed</h2>
                <p
                  style={{
                    textAlign: 'center',
                    margin: '16px 0px',
                    color: '#777777',
                  }}
                >
                  We ran into a problem while trying to update this product
                  please try again
                </p>
                <FlexibleDiv flexWrap="nowrap" gap="24px">
                  <Button
                    border="1px solid #FC5353"
                    color="#FC5353"
                    hoverBg="white"
                    hoverColor="var(--oosriPrimary)"
                    width="100%"
                    onClick={() => setOpenModal(false)}
                  >
                    Retry
                  </Button>
                  <Button
                    onClick={() => {
                      push('/products');
                    }}
                    border="1px solid #FC5353"
                    color="white"
                    backgroundColor="var(--oosriPrimary)"
                    width="100%"
                  >
                    Back to Products
                  </Button>
                </FlexibleDiv>
              </>
            ) : (
              <>
                <h2 style={{ textAlign: 'center' }}>
                  Product Updated Succesfully
                </h2>
                <p
                  style={{
                    textAlign: 'center',
                    margin: '16px 0px',
                    color: '#777777',
                  }}
                >
                  Your Produt Data has been updated Successfully
                </p>
                <FlexibleDiv flexWrap="nowrap" gap="24px">
                  <Button
                    onClick={() => {
                      closeModal();
                    }}
                    border="1px solid #FC5353"
                    color="white"
                    backgroundColor="var(--oosriPrimary)"
                    width="100%"
                  >
                    Close
                  </Button>
                </FlexibleDiv>
              </>
            )}
          </StyledModal>
        </CreateProductPageWrapper>
      )}
    </>
  );
}
