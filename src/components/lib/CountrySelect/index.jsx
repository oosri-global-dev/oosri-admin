import { useEffect, useState } from "react"
import Select from "../Select"
import { countries } from "@/data-helpers/auth-helpers"
export const CountrySelect=({onChange,placeholder,value,})=>{
   const [countryData,setCountryData]=useState("")

   useEffect(()=>{
    const item=[]
    for (let index = 0; index < countries.length; index++) {
        item.push({
            value:countries[index].code,
            label:countries[index].name,
    })
    }
    setCountryData(item)
   },[countries])

const handleChange=(e)=>[
    onChange(e),
]

    return(
        <Select options={countryData} defaultValue={countryData[0]?.label}  width="100%" placeholder={placeholder} onChange={(e)=>{handleChange(e)}} backgroundColor="#FAFAFA"/>
    )
}
