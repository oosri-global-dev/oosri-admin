import { CreateProductPageWrapper } from "./index.styles";
import DashboardLayout from "@/components/layouts/DashboardLayout/dashboard-layout";
import {  useEffect, useState } from "react";
import {  Tabs } from "antd";
import { CreateTab } from "./Tab/createTab";
import { getCategories } from "@/network/product";
import CustomLoader from "@/components/lib/CustomLoader";

export default function CreateProductPage(){
  const [activeTab,setActiveTab]=useState("")
  const[categories,setCategories]=useState([]) 
  const [displayCategories,setDisplayCategories]=useState([])
  const[loading,setLoading]=useState(true)
  const[subCategories,setSubCategories]=useState([])


  const handleSubCategories = () => {
    const selectedCategory = categories.find((category) => category.name === activeTab);
    if (selectedCategory) {
      setSubCategories(selectedCategory.subcategories);
    }
  };

  useEffect(()=>{
    const fetchAllProducts= async()=>{
      try{
        const data= await getCategories()
        const newCategories = categories;
        const items=[]

        for (let index = 0; index < data.data.data.length; index++) {
          newCategories.push(data.data.data[index]);    
          items.push(
            {
              key:data.data.data[index].name,
              label:data.data.data[index].name,
            }
          ) 
        }
        setCategories(newCategories);
        setDisplayCategories(items)
        setActiveTab(items[0].key)
        setLoading(false)
      }catch(errors){
        console.log(errors)
      }
    }
    handleSubCategories()
    fetchAllProducts()
  },[])

  useEffect(() => {
    if (activeTab && categories.length > 0) {
      handleSubCategories();
    }
  }, [activeTab, categories])


  const handleTabChange=(e)=>{
    setActiveTab(e)
  }

  return (
    <>
      {
        loading
        ?
        <CustomLoader />
     : <DashboardLayout title={"Add Product"} showBackBtn>
        <CreateProductPageWrapper>
          <Tabs
          className="tabs__custom"
          defaultActiveKey="1"
          items={displayCategories}
          onChange={(e) => handleTabChange(e)} />
          {
            
          }
          <CreateTab subCategories={subCategories} category={activeTab}/>

        </CreateProductPageWrapper>
      </DashboardLayout>
    }
    </>
  );
}
