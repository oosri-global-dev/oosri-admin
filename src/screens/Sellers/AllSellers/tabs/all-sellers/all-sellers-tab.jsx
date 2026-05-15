import Picture from '@/assets/images/profile.jpg';
import { HiOutlineEllipsisHorizontal as EllipsisIcon } from 'react-icons/hi2';
import { Table, Popover, Space, Avatar } from 'antd';
import Button from '@/components/lib/Button';
import { formatDate } from '@/utils/format-date';
import { useRouter } from 'next/router';

const PopoverContent = ({ obj, router }) => (
  <div className="popover__custom">
    <Button
      height="30px"
      radius="5px"
      onClick={() => {
        router.push(`/seller/${obj && obj?.id}`);
      }}
    >
      View Seller Details
    </Button>
    <Button
      height="30px"
      radius="5px"
      onClick={() => {
        setDeleteId(obj);
        setOpenModal(true);
      }}
    >
      Unverify Seller
    </Button>
  </div>
);

export default function AllSellersTab({ sellers, loading, error }) {
  //incase you unverify a seller later, should still be in all-sellers
  const router = useRouter();
  const sellersDataColumns = [
    {
      title: 'Picture',
      dataIndex: 'Picture',
      key: 'picture',
      render: (_) => (
        <Space>
          {/* item image */}
          <Avatar size={45} src={Picture.src} />
          <Space direction="vertical" size={1}>
            <p>{_}</p>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Seller Name',
      dataIndex: 'sellerName',
      key: 'sellerName',
      render: (_, obj) => (
        <Space>
          {/* item image */}
          {/* <Avatar size={45} src={Picture.src} /> */}
          <Space direction="vertical" size={1}>
            <p>
              {obj.firstName} {obj.lastName}
            </p>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Email Address',
      dataIndex: 'emailAddress',
      key: 'emailAddress',
      render: (_, obj) => (
        <Space>
          <Space direction="vertical" size={1}>
            <p>{obj.email}</p>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    // {
    //   title: "Phone Number",
    //   dataIndex: "phoneNumber",
    //   key: "phoneNumber",
    // },
    {
      title: 'Registration Date',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
      render: (_, obj) => {
        <Space>
          <Space direction="vertical" size={1}>
            <p>{formatDate(obj?.createdAt)}</p>
          </Space>
        </Space>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, obj) => (
        <Space size="middle">
          {obj?.isVerified === true ? (
            <p className="verified__text">{'Verified'}</p>
          ) : (
            <p className="unverified__text">{'Unverified'}</p>
          )}
        </Space>
      ),
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (_, obj) => (
        <Popover
          content={<PopoverContent obj={obj} router={router} />}
          trigger="click"
        >
          <EllipsisIcon style={{ cursor: 'pointer' }} />
        </Popover>
      ),
    },
  ];

  return (
    <Table
      columns={sellersDataColumns}
      dataSource={sellers}
      loading={loading}
      className="table__class"
    />
  );
}
