import React from 'react';
import { Select, Spin } from 'antd';
import { useCategories } from '@/hooks/useAnalytics';
const { Option } = Select;

const ProductCategorySelect = ({
  value,
  onChange,
  placeholder = 'Select Category',
  allowClear = true,
}) => {
  const { data: categories = [], isLoading, isError } = useCategories();

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ width: '90%' }}
      loading={isLoading}
      allowClear={allowClear}
      notFoundContent={
        isLoading ? (
          <Spin size="small" />
        ) : isError ? (
          'Failed to load'
        ) : (
          'No categories found'
        )
      }
    >
      {categories?.map((cat) => (
        <Option key={cat?._id} value={cat?.name}>
          {cat?.name}
        </Option>
      ))}
    </Select>
  );
};

export default ProductCategorySelect;
