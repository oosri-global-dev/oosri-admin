import { Space, Divider, Radio, Table } from 'antd';
import { FaEllipsis } from 'react-icons/fa6';
import { FlexibleDiv } from '@/components/lib/Box/styles';
import Link from 'next/link';

const SortSVG = () => (
  <svg
    width="16"
    height="15"
    viewBox="0 0 16 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.25 4.125L4.625 0.75M4.625 0.75L8 4.125M4.625 0.75V10.875M14.75 10.875L11.375 14.25M11.375 14.25L8 10.875M11.375 14.25L11.375 4.125"
      stroke="#777777"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows
    );
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === 'Disabled User',
    name: record.name,
  }),
};

export const orderTableColumns = (currency = 'NGN') => [
  {
    title: () => (
      <FlexibleDiv
        flexWrap="noWrap"
        gap="5px"
        className="sort__icons"
        justifyContent="start"
      >
        <p>Order Id</p>
        <SortSVG />
      </FlexibleDiv>
    ),
    dataIndex: 'orderId',
    key: 'orderId',
    render: (_, obj) => (
      <Space direction="vertical" size={1}>
        <p>{_}</p>
        <p className="item__number">{obj.itemNum} item</p>
      </Space>
    ),
    sorter: (a, b) => a.orderId - b.orderId,
    sortIcon: ({ sortOrder }) => (
      <FlexibleDiv className="sort__icons"></FlexibleDiv>
    ),
  },
  {
    title: () => (
      <FlexibleDiv
        flexWrap="noWrap"
        gap="5px"
        className="sort__icons"
        justifyContent="start"
      >
        <p>Order Date</p>
        <SortSVG />
      </FlexibleDiv>
    ),
    dataIndex: 'orderDate',
    key: 'orderDate',
    render: (_) => (
      <Space>
        <p>{_}</p>
      </Space>
    ),
  },
  {
    title: () => (
      <FlexibleDiv
        flexWrap="noWrap"
        gap="5px"
        className="sort__icons"
        justifyContent="start"
      >
        <p>Customer</p>
        <SortSVG />
      </FlexibleDiv>
    ),
    dataIndex: 'customerFullName',
    key: 'customerFullName',
    render: (_) => (
      <Space direction="column">
        <p>{_}</p>
      </Space>
    ),
  },
  {
    title: () => (
      <FlexibleDiv
        flexWrap="noWrap"
        gap="5px"
        className="sort__icons"
        justifyContent="start"
      >
        <p>Amount {currency === 'USD' ? '($)' : '(₦)'}</p>
        <SortSVG />
      </FlexibleDiv>
    ),
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    sortIcon: ({ sortOrder }) => (
      <FlexibleDiv className="sort__icons"></FlexibleDiv>
    ),
    render: (_, obj) => <p>{currency === 'USD' ? obj.formattedAmountUSD : obj.formattedAmountNGN}</p>,
    sorter: (a, b) => a.totalAmountNGN - b.totalAmountNGN,
  },
  {
    title: () => (
      <FlexibleDiv
        flexWrap="noWrap"
        gap="5px"
        className="sort__icons"
        justifyContent="start"
      >
        <p>Status</p>
        <SortSVG />
      </FlexibleDiv>
    ),
    dataIndex: 'orderStatus',
    key: 'orderStatus',
    render: (_, obj) => {
      console.log(obj, 'ORDER DETAILS');
      return (
        <Space size="middle">
          {_?.toLowerCase() === 'sent for pickup' && (
            <p className="sent__pickup">{capitalizeFirstLetter(_)}</p>
          )}
          {_?.toLowerCase() === 'delivered' && (
            <p className="delivered__pickup">{capitalizeFirstLetter(_)}</p>
          )}
          {_?.toLowerCase() === 'processing' && (
            <p className="sent__pickup">{capitalizeFirstLetter(_)}</p>
          )}
          {_?.toLowerCase() === 'canceled' && (
            <p className="sent__pickup">{capitalizeFirstLetter(_)}</p>
          )}
          {_?.toLowerCase() === 'pending' && (
            <p className="sent__pickup">{capitalizeFirstLetter(_)}</p>
          )}
        </Space>
      );
    },
  },
  {
    title: () => (
      <FlexibleDiv
        flexWrap="noWrap"
        gap="5px"
        className="sort__icons"
        justifyContent="start"
      >
        <p>Payment Status</p>
        <SortSVG />
      </FlexibleDiv>
    ),
    dataIndex: 'paymentStatus',
    render: (_, obj) => {
      const togglePopup = () => {
        const element = document.getElementById(obj.orderId);
        if (element) {
          console.log(element.classList);
          if (element.classList.length > 1) {
            element.classList.remove('invinsible');
          } else {
            element.classList.add('invinsible');
          }
        }
      };

      return (
        <FlexibleDiv justifyContent="space-between" padding="0px 6px 0px 0px">
          <p className={_.toLowerCase() === 'paid' ? 'paid' : 'delivery_pay'}>
            {capitalizeFirstLetter(_)}
          </p>
          <div className="details__container">
            <FaEllipsis onClick={togglePopup} />
            <Link
              href={`/order/${obj.orderId}`}
              className="details__popup invinsible"
              id={obj.orderId}
            >
              <div>
                <p>View Details</p>
              </div>
            </Link>
          </div>
        </FlexibleDiv>
      );
    },
  },
];
