import React, { useState } from 'react'
import { MultiSearchBarWrapper, SearchItemWrapper } from './index.styles'
import { Input } from "antd";
import { FiSearch } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { FlexibleDiv } from '../Box/styles';

export default function CustomMultiSearchBar ({placeholder,Multi=false,onChange=(e)=>{},width}) {
  const [inputValue, setInputValue] = useState("")
  const [searchItems, setSearchItems] = useState([])
  const [isFocused, setIsFocused] = useState(false);

  const SearchItem=({ item, onDelete })=>{
    return(
        <SearchItemWrapper flexWrap="noWrap" gap="6px" padding="2px 6px">
           <img src="https://placehold.co/400" alt="" />
           <p>{item}</p>
           <IoCloseOutline onClick={onDelete} />
        </SearchItemWrapper>
    )
  }
  // Check if the 'Enter' key was pressed and the input is focused
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isFocused) {
      const wordRegex = /^\S+$/;
      if(wordRegex.test(inputValue)){
        setSearchItems((prevItems) => {
          const newItems = [...prevItems, inputValue];
          return newItems.length > 2 ? newItems.slice(1) : newItems; // Remove the first item if there are more than 5
        });
        setInputValue("")
      }
    }
  };
  // handle input change
  const handleChange = (e) =>{
    setInputValue(e.target.value)
    onChange(e)
  }
  // Handle search deletion
  const handleDeleteItem = (itemToDelete) => {
    setSearchItems((prevItems) => prevItems.filter(item => item !== itemToDelete));
  };

  return (
    <MultiSearchBarWrapper width={width}>
      {Multi?
        <Input 
        addonBefore={
          <FlexibleDiv flexWrap="noWrap" gap="6px"> 
            <FiSearch/> 
              {searchItems.length > 0 && searchItems.map(item => (
                <SearchItem key={item} item={item} onDelete={() => handleDeleteItem(item)} />
              ))}
          </FlexibleDiv>
        } 
          placeholder={searchItems.length > 0 ? "" : placeholder} 
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          onChange={(e)=>handleChange(e)}
          value={inputValue}
        /> 
        :
        <Input addonBefore={<FiSearch/>} placeholder={placeholder} onChange={handleChange} /> 
        }
    </MultiSearchBarWrapper>
  )
}
