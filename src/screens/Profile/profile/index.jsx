import { FlexibleDiv } from '@/components/lib/Box/styles'
import Button from '@/components/lib/Button'
import { CustomUpload } from '@/components/lib/CustomUpload'
import { Form, Modal } from 'antd'
import React, { useContext, useState } from 'react'
import { MainContext } from "@/context";
import TextField from "@/components/lib/TextField";
import Select from "@/components/lib/Select";
import { ProfileWrapper } from './index.styles'

export const BusinessProfile = ({businessData,setBusinessData,handleSubmit,businessTypeOptions,setPayload,payload,setVatCertificate,setCompantCertificate,isLoading,toggleEditMode,isEditMode}) => {
  const [form] = Form.useForm();

  return (
        <ProfileWrapper>
          <FlexibleDiv alignItems={"end"} gap={"10%"} className='total_container'  justifyContent={"start"}>
              <FlexibleDiv style={{flexBasis:"70%"}} width={"100%"} justifyContent={"start"} >
                    <h2>Business Details</h2>
                <Form form={form} onFinish={isEditMode ? handleSubmit : undefined}>
                    {/* Business Name and type */}
                    <FlexibleDiv gap={"20px"} className='business_type_name'>
                      {/* Business name */}
                      <FlexibleDiv flexDir={"column"} alignItems="flex-start" width="100%" gap="5px" className="single__row">
                          <label>Business Name</label>
                     {isEditMode ? (
                      <TextField
                        name="name"
                        placeholder="Enter business name"
                        defaultValue={businessData.name}
                        disabled
                      />
                    ) : (
                      <p>{businessData.name}</p>
                    )}
                      </FlexibleDiv>
                        {/* Business Type */}
                        <FlexibleDiv flexDir="column"alignItems="flex-start" width="100%" gap="5px">
                          <label>Business Type</label>
                          {isEditMode ? (
                                <Select
                                  name="type"
                                  placeholder="Select business type"
                                  defaultValue={businessData.businessType}
                                  options={businessTypeOptions}
                                  width={"100%"}
                                  disabled
                                />
                              ) : (
                                <p>{businessData.businessType}</p>
                              )}
                        </FlexibleDiv>
                    </FlexibleDiv>

                    {/* reg num and business address */}
                    <FlexibleDiv justifyContent={"start"} gap={"20px"} className='business_type_name' >
                      <FlexibleDiv
                        flexDir="column"
                        alignItems="flex-start"
                        width="100%"
                        gap="5px"                   >
                        {/* Registration Number */}
                          <label>Business Registration Number</label>
                          {isEditMode ? (
                            <TextField name="regNum" placeholder="Enter registration number"
                              defaultValue={businessData.regNum} disabled />
                          ) : (
                        <p>{businessData.regNum}</p>
                          )}
                      </FlexibleDiv>
                      {/* Business Address */}
                      <FlexibleDiv
                        flexDir="column"
                        alignItems="flex-start"
                        width="100%"
                        gap="5px"
                        className="single__row"
                      >
                        <label>Business Address</label>
                        {isEditMode ? (
                                <TextField
                                  name="regNum"
                                  placeholder="Enter registration number"
                                  defaultValue={businessData.address}
                                  onChange={(e)=>{
                                    setPayload({...payload,companyAddress:e.target.value})
                                    setBusinessData((prev)=>({
                                      ...prev,
                                      address:e.target.value
                                    }))
                                  }}
                                />
                              ) : (
                                <p>{businessData.address}</p>
                              )}
                      </FlexibleDiv>
                    </FlexibleDiv>

                  <FlexibleDiv className='business_type_name' margin={"15px 0px 0px 0px"} >
                      <FlexibleDiv style={{
                        display:"flex",
                        flexDirection:"column",
                        alignItems:"flex-start",
                        width:"100%"
                    }}>
                        <CustomUpload setFile={setVatCertificate} editable={isEditMode} title="Government Identification" initialImage={businessData.companyCertificate}/>
                      </FlexibleDiv>

                      <FlexibleDiv style={{
                        display:"flex",
                        flexDirection:"column",
                        alignItems:"flex-start",
                        width:"100%",
                      }}>
                        <CustomUpload setFile={setCompantCertificate} editable={isEditMode} title="Business Registration Certificate" initialImage={businessData.businessCertificate}/>
                      </FlexibleDiv>
                  </FlexibleDiv>
                </Form>
              </FlexibleDiv>
              <FlexibleDiv className='btn__submit' style={{flexBasis:"20%"}} width={"100%"}>
               <Button type="submit" radius="8px" color="var(--oosriWhite)"  backgroundColor="var(--oosriPrimary)"  
               isLoading={isLoading}
               onClick={isEditMode ? handleSubmit: toggleEditMode}
               >
                  {isEditMode ? "Save Details" : "Edit Details"}
                </Button>
              </FlexibleDiv>
          </FlexibleDiv>
          </ProfileWrapper>
  )
}
