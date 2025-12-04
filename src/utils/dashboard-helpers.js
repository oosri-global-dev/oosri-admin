import {
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { GoStack as StackIcon } from 'react-icons/go';
import { IoBagOutline as BagIcon } from 'react-icons/io5';
import { CiCreditCard1 as CardIcon } from 'react-icons/ci';
import { HiOutlineUsers as UserIcon } from 'react-icons/hi2';
import { HiOutlineShoppingBag as ProductIcon } from 'react-icons/hi2';
import { MdPayments as PaymentIcon } from 'react-icons/md';
import { VscGraph as GraphIcon } from 'react-icons/vsc';
import { IoSettingsOutline as SettingsIcon } from 'react-icons/io5';
import { Avatar, Dropdown, Menu, Space, Tag } from 'antd';
import Picture from '@/assets/images/profile.jpg';
import { useAnalyticsData } from '@/hooks/useAnalytics';



export const summaryBoxes = [
  {
    icon: <StackIcon size={22} color="#FB5183" />,
    value: '1080',
    label: 'Total Products',
  },
  {
    icon: <BagIcon size={22} color="#FB5183" />,
    value: '20',
    label: 'Total Order',
  },
  {
    icon: <CardIcon size={22} color="#FB5183" />,
    value: 'N10,580',
    label: 'Profit',
  },
];

//Sales Data
export const salesBoxes = [
  {
    icon: <StackIcon size={22} color="#FB5183" />,
    value: 'N50,30.098',
    label: 'Total Sale',
  },
  {
    icon: <BagIcon size={22} color="#FB5183" />,
    value: 'N10,560.098',
    label: 'Total Order',
  },
];

export const summaryBoxes2 = [
  {
    icon: <StackIcon size={22} color="#FB5183" />,
    value: 'N50,300.98',
    label: 'Total Sales',
  },
  {
    icon: <BagIcon size={22} color="#FB5183" />,
    value: 'N10,560.98',
    label: 'Total Orders',
  },
];

const dropdownItems = [
  {
    key: '1',
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        1st menu item
      </a>
    ),
  },
];

export const dashboardTableColumns = [
  {
    title: 'OrderId',
    dataIndex: 'orderId',
    key: 'orderId',
    render: (_) => (
      <Space>
        {/* item image */}
        <Avatar size={45} src={Picture.src} />
        <Space direction="vertical" size={1}>
          <p>{_}</p>
          <p className="item__number">2 item</p>
        </Space>
      </Space>
    ),
  },
  {
    title: 'Order Date',
    dataIndex: 'orderDate',
    key: 'orderDate',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Customer',
    dataIndex: 'customer',
    key: 'customer',
    render: (_) => (
      <Space>
        <Avatar size={28} src={Picture.src} />
        <p>{_}</p>
      </Space>
    ),
  },
  {
    title: 'Country',
    dataIndex: 'country',
    key: 'country',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (_, obj) => (
      <Space size="middle">
        {_?.toLowerCase() === 'sent for pickup' && (
          <p className="sent__pickup">{_}</p>
        )}
        {_?.toLowerCase() === 'delivered' && (
          <p className="delivered__pickup">{_}</p>
        )}
      </Space>
    ),
  },
  {
    title: 'hi',
    dataIndex: 'action',
    key: 'action',
    render: () => <div>Dropdown</div>,
  },
];

export const dashboardTableData = [
  {
    key: 'orderId',
    orderId: '#777780',
    orderDate: '27th April, 2023',
    amount: 'N7000',
    customer: 'Ajayi Opeyemi',
    country: 'Nigeria',
    status: 'Sent for pickup',
  },
  {
    key: 'orderId1',
    orderId: '#777480',
    orderDate: '27th April, 2023',
    amount: 'N7000',
    customer: 'Ajayi Opeyemi',
    country: 'Nigeria',
    status: 'Delivered',
  },
  {
    key: 'orderId2',
    orderId: '#773780',
    orderDate: '27th April, 2023',
    amount: 'N7000',
    customer: 'Ajayi Opeyemi',
    country: 'Nigeria',
    status: 'Sent for pickup',
  },
  {
    key: 'orderId4',
    orderId: '#227780',
    orderDate: '27th April, 2023',
    amount: 'N7000',
    customer: 'Ajayi Opeyemi',
    country: 'Nigeria',
    status: 'Delivered',
  },
];
