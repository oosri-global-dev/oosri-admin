import { FlexibleDiv } from "../../../../components/lib/Box/styles"
import Select from "../../../../components/lib/Select"
import { Input, Upload } from "antd"
import { use, useEffect, useState } from "react"
import { CustomUpload } from "../../../../components/lib/CustomUpload"
import { createProduct } from "@/network/product"
import Button from "@/components/lib/Button"
import { StyledModal } from "@/components/lib/Modal/index.styles";
import { CustomInput } from "@/components/lib/CustomInput/index.styles"

const {TextArea}=Input

export const CreateTab=({subCategories,category})=>{
    const [img1,setImg1]=useState()
    const [img2,setImg2]=useState()
    const [img3,setImg3]=useState()
    const [img4,setImg4]=useState()
    const[productName,setProductName]=useState("")
    const[productDescription,setProductDescription]=useState("")
    const[brandArtist,setBrandArtist]=useState("")
    const[weight,setWeight]=useState("")
    const [openModal,setOpenModal]=useState(false)
    const [categoryItem,setCategoryItem]=useState([])
    const[subCategory,setSubCategory]=useState("")
    const [productType,setProductType]=useState()
    const [regularPrice,setRegularPrice]=useState(0)
    const [salesPrice,setSalesPrice]=useState(0)
    const [salesError,setSalesError]=useState(false)
    const [width,setWidth]=useState("")
    const [height,setHeight]=useState("")
    const [technique,setTechnique]=useState("")
    const [length,setLength]=useState("")
    const [fabricType,setFabricType]=useState("")
    const [clayType,setClayType]=useState("")
    const [glaze,setGlaze]=useState("")
    const [diameter,setDiameter]=useState("")
    const [pattern,setPattern]=useState("")
    const [stoneType,setStoneType]=useState("")
    const [metalType,setMetalType]=useState("")
    const [medium,setMedium]=useState("")
    const [condition,setCondition]=useState("")
    const [size,setSize]=useState("")
    const[modalError,setModalError]=useState(false)
    const[errorText,setErrorText]=useState(" ")
    const [yard,setYard]=useState("")
    const[clearImage,setClearImg]=useState(false)

  const payload={
    category:category,
    productName:productName,
    productDescription:productDescription,
    brandArtist:brandArtist,
    images:[img1,img2,img3,img4],
    subcategory:subCategory?.value,
    salesPrice:salesPrice,
    regularPrice:regularPrice,
    productType:productType,
    ...(category === "Sculpture" && {
      width: width,
      weight:weight,
      height: height,
      technique: technique,
    }),
    ...(category === "Jewelry" && {
      length: length,
      diameter:diameter,
      stoneType: stoneType,
      metalType: metalType,
    }),
    ...(category === "Paintings" && {
      medium: medium,
      condition:condition,
      size:size,
    }),
    ...(category === "Pottery" && {
      height: height,
      diameter:diameter,
      clayType: clayType,
      glaze: glaze,
    }),
    ...(category === "Textiles/Fabrics" && {
      yard:yard,
      weight:weight,
      fabricType: fabricType,
      pattern:pattern,
    }),
  }

  const handleModalClose=()=>{
   setClearImg(true)
   setImg1(null)     
   setImg2(null)     
   setImg3(null)     
   setImg4(null)   
   setProductName("")
   setProductDescription("")  
   setBrandArtist("")
   setWeight("")
   setProductType("")
   setRegularPrice("")
   setSalesPrice()
   setWidth("")
   setHeight()
   setTechnique()
   setLength()
   setFabricType()
   setGlaze()
   setClayType()
   setDiameter()
   setPattern()
   setStoneType()
   setMetalType()
   setMedium()
   setCondition()
   setSize()
   setOpenModal(false)
   setModalError(false)
   setYard(" ")
  }
      useEffect(()=>{
        if(subCategories){
          const item=[]
          for (let index = 0; index < subCategories.length; index++) {
            item.push(
              {
                value:subCategories[index].name,
                label:subCategories[index].name,
              }
            )
          }
          setCategoryItem(item)
          setSubCategory(item[0])
        }
      },[subCategories])

      useEffect(()=>{
        handleModalClose()
      },[category])
      const productTypeItem=[
        {value:"simple",label:"Simple"},
        {value:"variable",label:"Variable"}
      ]

      const conditionItem=[
        {value:"New",label:"New"},
        {value:"Used",label:"Used"},
        {value:"Antique",label:"Antique"}
      ]

      const handleCreateProduct=async ()=>{
        try{
          await createProduct(payload)
          setModalError(false)
          handleModalOpen()
        }catch(errors){
          setModalError(true)
          handleModalOpen()
          setErrorText(errors.response.data.error)
        }
      }

      const handleModalOpen=()=>{
        setOpenModal(true)
      }

      const handleSalesPrice=(e)=>{
        setRegularPrice(e)
        setSalesPrice(e - (e * 5/100)) 
      }

    return(
      <>
      <FlexibleDiv className="tab__item">
          <FlexibleDiv className="container_wrapper" alignItems="start">
            {/* Left section */}
          <FlexibleDiv className="50%" flexDir="column" alignItems="start" gap="24px">
            <FlexibleDiv justifyContent="start" alignItems="start" gap="16px">
              {/* Name */}
              <div className="product__item">
                <label htmlFor="Name">Product Name</label>
                  <CustomInput width={"100%"} placeholder="Input product name" backgroundColor="#FAFAFA" value={productName} onChange={(e)=>{setProductName(e.target.value)}}/>
                  <p>Do not exceed 40 characters while entering name</p>
              </div>
            </FlexibleDiv>
            {/* Category */}
            <div className="product__item">
                <label htmlFor="Name">Product Category</label>
                <Select options={categoryItem} value={subCategory} onChange={(e)=>{setSubCategory(e)}} backgroundColor="#FAFAFA" width="100%"/>
            </div>
            {/* Brand */}
            <div className="product__item">
                <label htmlFor="Name">Brand</label>
                <CustomInput placeholder="Select product brand" backgroundColor="#FAFAFA" onChange={(e)=>{setBrandArtist(e.target.value)}} value={brandArtist}/>
            </div>
            {/* Product Type */}
            <div className="product__item">
                <label htmlFor="Name">Product Type</label>
                <Select placeholder="Input product display type" backgroundColor="#FAFAFA" value={productType} options={productTypeItem} onChange={(e)=>{setProductType(e)}} width="100%"/>
            </div>
            {/* Regular Price */}
            <div className="product__item">
                <label htmlFor="Name">Regular Price(NGN)</label>
                <CustomInput placeholder="Input Product Price" value={regularPrice} backgroundColor="#FAFAFA" type="number" onChange={(e)=>{handleSalesPrice(e.target.value)}} />
            </div>
            {/* Sales Price */}
            <div className="product__item">
                <label htmlFor="Name">Sales Price(NGN)</label>
                <CustomInput placeholder="Input Product Price" value={salesPrice} backgroundColor="#FAFAFA" disabled type="number"/>
            </div>
          </FlexibleDiv>
          {/* right section */}
          <FlexibleDiv flexDir="column" gap="24px" alignItems="start" width="100%">
            <FlexibleDiv className="img__upload" justifyContent="start">
              <CustomUpload editable setFile={setImg1} initialImage={img1} clearImage={clearImage} setClearImg={setClearImg}/>
              <CustomUpload editable setFile={setImg2} initialImage={img2} clearImage={clearImage} setClearImg={setClearImg}/>
              <FlexibleDiv flexDir="column" className="column_item" width="fit-content">
                <CustomUpload editable setFile={setImg3} initialImage={img3} clearImage={clearImage} setClearImg={setClearImg}/>
                <CustomUpload editable setFile={setImg4} initialImage={img4} clearImage={clearImage} setClearImg={setClearImg}/>
              </FlexibleDiv>
            </FlexibleDiv>
            {/*Product Description*/}
            <div className="product__item">
                <label htmlFor="Name">Product Description</label>
                <TextArea placeholder="Minimum of 1000 words" width="100%" value={productDescription} onChange={(e)=>{setProductDescription(e.target.value)}}/>
            </div>
            {
              category==="Sculpture"?
              <>
              {/* Weight */}
              <div className="product__item">
                  <label htmlFor="Name">Weight</label>
                  <CustomInput value={weight} placeholder="Input Product Weight" backgroundColor="#FAFAFA" onChange={((e)=>{setWeight(e.target.value)})} type="number"/>
              </div>
              {/* Width */}
              <div className="product__item">
                  <label htmlFor="Name">Width</label>
                  <CustomInput value={width} placeholder="Input Product Width" backgroundColor="#FAFAFA" onChange={((e)=>{setWidth(e.target.value)})} type="number"/>
              </div>
              {/* Height */}
              <div className="product__item">
                  <label htmlFor="Name">Height</label>
                  <CustomInput value={height} placeholder="Input Product Height" backgroundColor="#FAFAFA" onChange={((e)=>{setHeight(e.target.value)})} type="number"/>
              </div>
              {/* Technique */}
              <div className="product__item">
                  <label htmlFor="Name">Technique</label>
                  <CustomInput value={technique} placeholder="Input Product Technique" backgroundColor="#FAFAFA" onChange={((e)=>{setTechnique(e.target.value)})}/>
              </div>
              </>:category==="Textiles/Fabrics"?
              <>
              {/* Weight */}
              <div className="product__item">
                  <label htmlFor="Name">Weight</label>
                  <CustomInput value={weight} placeholder="Input Product Weight" backgroundColor="#FAFAFA" onChange={((e)=>{setWeight(e.target.value)})} type="number"/>
              </div>
              {/* yard */}
              <div className="product__item">
                  <label htmlFor="Name">Yards</label>
                  <CustomInput value={yard} placeholder="Input Product Yards" backgroundColor="#FAFAFA" onChange={((e)=>{setYard(e.target.value)})} type="number"/>
              </div>
              {/* Pattern */}
              <div className="product__item">
                  <label htmlFor="Name">Pattern</label>
                  <CustomInput value={pattern} placeholder="Input Product Pattern" backgroundColor="#FAFAFA" onChange={((e)=>{setPattern(e.target.value)})}/>
              </div>
              {/* FabricType */}
              <div className="product__item">
                  <label htmlFor="Name">Fabric Type</label>
                  <CustomInput value={fabricType} placeholder="Input Product Fabric Type" backgroundColor="#FAFAFA" onChange={((e)=>{setFabricType(e.target.value)})}/>
              </div>
              </>:category==="Pottery"?
              <>
                  {/* Diameter */}
                  <div className="product__item">
                  <label htmlFor="Name">Diameter</label>
                  <CustomInput value={diameter} placeholder="Input Product Diameter" backgroundColor="#FAFAFA" onChange={((e)=>{setDiameter(e.target.value)})} type="number"/>
                   </div>
                  {/* ClayType */}
                  <div className="product__item">
                      <label htmlFor="Name">Clay Type</label>
                      <CustomInput value={clayType} placeholder="Input Clay Type" backgroundColor="#FAFAFA" onChange={((e)=>{setClayType(e.target.value)})}/>
                  </div>
                  {/* Height */}
                  <div className="product__item">
                      <label htmlFor="Name">Height</label>
                      <CustomInput value={height} placeholder="Input Product Height" backgroundColor="#FAFAFA" onChange={((e)=>{setHeight(e.target.value)})} type="number"/>
                  </div>
                  {/* Glaze */}
                  <div className="product__item">
                      <label htmlFor="Name">Glaze</label>
                      <CustomInput value={glaze} placeholder="Input Product Glaze" backgroundColor="#FAFAFA" onChange={((e)=>{setGlaze(e.target.value)})}/>
                  </div>
              </>:category==="Paintings"?
              <>
                  {/* Medium */}
                  <div className="product__item">
                  <label htmlFor="Name">Medium</label>
                  <CustomInput value={medium} placeholder="Input Painting Medium" backgroundColor="#FAFAFA" onChange={((e)=>{setMedium(e.target.value)})}/>
                   </div>
                  {/* Condition */}
                  <div className="product__item">
                      <label htmlFor="Name">Condition</label>
                       <Select value={condition} width="100%" placeholder="Input Painting Condition" backgroundColor="#FAFAFA" options={conditionItem} onChange={(e)=>{setCondition(e)}} />
                  </div>
                  {/* Size */}
                  <div className="product__item">
                      <label htmlFor="Name">Size</label>
                      <CustomInput value={size} placeholder="Input Painting Size" backgroundColor="#FAFAFA" onChange={((e)=>{setSize(e.target.value)})} type="number"/>
                  </div>
              </>:category==="Jewelry"&&
              <>
                {/* length */}
                <div className="product__item">
                    <label htmlFor="Name">Length</label>
                    <CustomInput value={length} placeholder="Input Product Length" backgroundColor="#FAFAFA" onChange={((e)=>{setLength(e.target.value)})} type="number"/>
                </div>
                {/* Diameter */}
                <div className="product__item">
                    <label htmlFor="Name">Diameter</label>
                    <CustomInput value={diameter} placeholder="Input Product Diameter" backgroundColor="#FAFAFA" onChange={((e)=>{setDiameter(e.target.value)})} type="number"/>
                </div>
                {/* stoneType */}
                <div className="product__item">
                    <label htmlFor="Name">Stone Type</label>
                    <CustomInput value={stoneType} placeholder="Input Stone Type" backgroundColor="#FAFAFA" onChange={((e)=>{setStoneType(e.target.value)})} />
                </div>
                {/* Metal type */}
                <div className="product__item">
                    <label htmlFor="Name">Metal Type</label>
                    <CustomInput value={metalType} placeholder="Input Metal Type" backgroundColor="#FAFAFA" onChange={((e)=>{setMetalType(e.target.value)})} />
                </div>
              </>
            }
          </FlexibleDiv>
        </FlexibleDiv>
          {/* Add Button */}
          <FlexibleDiv justifyContent="end" margin="15px 0px 0px 0px" className="add_btn"> 
            <Button onClick={handleCreateProduct}>
              Add Product
            </Button>
          </FlexibleDiv>
      </FlexibleDiv>
            {/* Modal */}
            <StyledModal maskClosable={true} open={openModal} centered closeIcon={null} className="modal" footer={null}>
            {
              modalError?
              <>
                <h2 style={{textAlign:"center"}}>Product Submission Failed</h2>
                <p style={{textAlign:"center",margin:"16px 0px", color:"#777777"}}>{errorText}</p>
              </>:
              <>
                <h2 style={{textAlign:"center"}}>Product Submission Received</h2>
                <p style={{textAlign:"center",margin:"16px 0px", color:"#777777"}}>Thank you for adding your product to our platform. Your listing has been received and is now in the review process. Our team will carefully assess your product to ensure it meets our quality standards and guidelines.</p>
              </>
            }
              <FlexibleDiv flexWrap="nowrap" gap="24px">
                <Button border="1px solid #FC5353" color="#FC5353" hoverBg="white" hoverColor="var(--oosriPrimary)" width="100%" onClick={()=>{modalError?setOpenModal(false):handleModalClose()}}>Cancel</Button>
                <Button onClick={()=>window.location="/products"} border="1px solid #FC5353" color="white" backgroundColor="var(--oosriPrimary)" width="100%">Go to All Product</Button>
              </FlexibleDiv>
            </StyledModal>
      </>
    )
}