import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Table, Space, Avatar, Popover, Switch } from 'antd';
import { IoSearchOutline as SearchIcon } from 'react-icons/io5';
import { LuArrowUpDown as FilterArrow } from 'react-icons/lu';
import { HiOutlineEllipsisHorizontal as EllipsisIcon } from 'react-icons/hi2';
import DashboardLayout from '@/components/layouts/DashboardLayout/dashboard-layout';
import { AllProductsWrapper } from './all-products.styles';
import { FlexibleDiv } from '@/components/lib/Box/styles';
import Button from '@/components/lib/Button';
import TextField from '@/components/lib/TextField';
import { StyledModal } from '@/components/lib/Modal/index.styles';
import { useProducts } from '@/hooks/useProducts';
import { deleteProduct } from '@/network/product';
import { useQueryClient } from '@tanstack/react-query';
import { useToggleVisibility } from '@/hooks/useToggleVisibility';

export default function AllProductsScreen() {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [editModal, setEditModal] = useState(true);
  const [deleteId, setDeleteId] = useState('');
  const [sort, setSort] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
    page: 1,
    limit: 10,
    sortBy: 'newest',
  });

  const [modalError, setModalError] = useState(false);
  const { data, isLoading } = useProducts(filters);
  const allProducts = data?.body?.products || [];
  const [tempProducts, setTempProducts] = useState(allProducts);

  useEffect(() => {
    if (allProducts && allProducts?.length > 0) {
      setTempProducts(allProducts);
    }
  }, [allProducts]);

  const pagination = data?.body?.pagination || {};
  const [toggleLoading, setToggleLoading] = useState({});
  const handleToggle = useToggleVisibility(setToggleLoading, setTempProducts);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        keyword: searchTerm,
        page: 1,
      }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page, pageSize) => {
    setFilters((prev) => ({
      ...prev,
      page: page,
      limit: pageSize,
    }));
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setFilters((prev) => ({
      ...prev,
      sortBy: newSort,
      page: 1,
    }));
  };

  const handleDelete = async (param) => {
    try {
      await deleteProduct(param);
      setModalError(false);
      setEditModal(false);
      setFilters((prev) => ({ ...prev }));
    } catch (errors) {
      setModalError(true);
    }
  };

  // const handleToggle = async (checked, obj) => {
  //   const data = await toggleProductVisibility(obj._id, { isVisible: checked });
  //   console.log(data, 'toggle product visibility');
  //   console.log({ invisible: checked }, 'is Product Visible');
  //   return data;
  // };

  const productsTableColumns = [
    {
      title: (
        <FlexibleDiv justifyContent="start" padding="0 0 0 40px">
          Product Name
        </FlexibleDiv>
      ),
      dataIndex: 'productName',
      key: 'productName',
      render: (_, obj) => (
        <Space>
          <Avatar size={45} src={obj?.images?.[0]} />
          <Space direction="vertical" size={1}>
            <p>{_}</p>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Brand Name',
      dataIndex: 'brandArtist',
      key: 'brandArtist',
    },
    {
      title: 'Seller',
      dataIndex: 'seller',
      key: 'seller',
      render: (_, obj) => (
        <Space>
          {obj?.seller ? (
            <p>
              {obj?.seller?.firstName} {obj?.seller?.lastName}
            </p>
          ) : (
            <p>Null</p>
          )}
        </Space>
      ),
    },
    {
      title: 'Product ID',
      dataIndex: 'productId',
      key: 'productId',
    },
    {
      title: 'Price',
      dataIndex: 'regularPrice',
      key: 'regularPrice',
      render: (_) => <p>${_?.toFixed(2)}</p>,
    },
    {
      title: 'In stock',
      dataIndex: 'inStock',
      key: 'inStock',
      align: 'center',
      render: (_) => <p>{_ ? 'Yes' : 'No'}</p>,
    },
    {
      title: 'Visibility',
      dataIndex: 'isVisible',
      key: 'isVisible',
      render: (isVisible, obj) => {
        // console.log('Rendering switch for:', obj._id, isVisible);
        return (
          <Switch
            checked={isVisible}
            loading={!!toggleLoading[obj._id]}
            onChange={(checked) => handleToggle(checked, obj)}
          />
        );
      },
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (_, obj) => (
        <Popover
          content={
            <div className="popover__custom">
              <Button
                height="30px"
                radius="5px"
                onClick={() => {
                  router.push(`/product/${obj && obj?._id}`);
                }}
              >
                View More Details
              </Button>
              {/* <Button
                height="30px"
                radius="5px"
                onClick={() => {
                  setDeleteId(obj);
                  setOpenModal(true);
                }}
              >
                Unpublish Details
              </Button> */}
            </div>
          }
          trigger="click"
        >
          <EllipsisIcon style={{ cursor: 'pointer' }} />
        </Popover>
      ),
    },
  ];

  const filterContent = () => (
    <div className="popover__custom">
      <Button
        height="30px"
        radius="5px"
        onClick={() => handleSortChange('newest')}
        width="100%"
        hoverColor="var(--oosriBlack)"
        style={{
          backgroundColor:
            sort === 'newest' ? 'var(--oosriPrimary)' : 'transparent',
          color:
            sort === 'newest'
              ? 'var(--oosriWhite) !important'
              : 'var(--oosriBlack)',
        }}
      >
        Newest First
      </Button>
      <Button
        height="30px"
        width="100%"
        radius="5px"
        onClick={() => handleSortChange('oldest')}
        hoverColor="var(--oosriBlack)"
        style={{
          backgroundColor:
            sort === 'oldest' ? 'var(--oosriPrimary)' : 'transparent',
          color:
            sort === 'oldest'
              ? 'var(--oosriWhite) !important'
              : 'var(--oosriBlack)',
        }}
      >
        Oldest First
      </Button>
      <Button
        height="30px"
        width="100%"
        radius="5px"
        onClick={() => handleSortChange('price_asc')}
        hoverColor="var(--oosriBlack)"
        style={{
          backgroundColor:
            sort === 'price_asc' ? 'var(--oosriPrimary)' : 'transparent',
          color:
            sort === 'price_asc'
              ? 'var(--oosriWhite) !important'
              : 'var(--oosriBlack)',
        }}
      >
        Ascending Price
      </Button>
      <Button
        height="30px"
        width="100%"
        radius="5px"
        onClick={() => handleSortChange('price_desc')}
        hoverColor="var(--oosriBlack)"
        style={{
          backgroundColor:
            sort === 'price_desc' ? 'var(--oosriPrimary)' : 'transparent',
          color:
            sort === 'price_desc'
              ? 'var(--oosriWhite) !important'
              : 'var(--oosriBlack)',
        }}
      >
        Descending Price
      </Button>
    </div>
  );

  return (
    <AllProductsWrapper>
      <FlexibleDiv
        flexDir="column"
        alignItems="space-between"
        className="products__table__section"
      >
        <FlexibleDiv
          flexDir="row"
          justifyContent="space-between"
          flexWrap="nowrap"
          className="search__body__section"
        >
          <FlexibleDiv
            className="search__section"
            flexDir="row"
            flexWrap="nowrap"
          >
            <SearchIcon size={18} className="search__icon" />
            <TextField
              id="search"
              className="text__field__custom"
              placeholder="Search by products name"
              autoComplete="new-password"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </FlexibleDiv>
          <Popover content={filterContent} trigger="click">
            <Button
              border="1px solid #E0E0E0"
              height="38px"
              className="filter__btn__custom"
              hoverBg="transparent"
              radius="8px"
              hoverBorderColor="var(--oosriPrimary) !important"
              hoverColor="var(--oosriBlack)"
            >
              <FilterArrow size={16} color="black" />
              Filter
            </Button>
          </Popover>
        </FlexibleDiv>
        <FlexibleDiv className="products__table__wrapper">
          <Table
            columns={productsTableColumns}
            dataSource={tempProducts}
            className="table__class"
            loading={isLoading}
            pagination={{
              current: pagination?.currentPage || filters.page,
              pageSize: filters.limit,
              total: pagination?.total || 0,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${pagination?.total} items`,
              onChange: handlePageChange,
            }}
            rowKey="_id"
          />
        </FlexibleDiv>
      </FlexibleDiv>

      {/* Delete Confirmation Modal */}
      <StyledModal
        maskClosable={true}
        open={openModal}
        centered
        closeIcon={null}
        className="modal"
        footer={null}
      >
        {/* Modal content remains the same */}
      </StyledModal>
    </AllProductsWrapper>
  );
}
