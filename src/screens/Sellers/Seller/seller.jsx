import { useState } from 'react';
import { SellerWrapper } from './seller.styles';
import DashboardLayout from '@/components/layouts/DashboardLayout/dashboard-layout';
import { Tabs } from 'antd';
import PersonalDetails from './tabs/personal-details';
import BusinessDetails from './tabs/business-details';
import BankDetails from './tabs/bank-details';
import { useSeller } from '@/hooks/useSeller';

export default function Seller({ sellerId }) {
  const [activeTab, setActiveTab] = useState('personal-details');
  const { data, isLoading, error } = useSeller(sellerId);
  const sellerData = data?.data?.body || {};

  const personalDetails =
    {
      firstName: sellerData?.firstName,
      lastName: sellerData?.lastName,
      email: sellerData?.email,
      country: sellerData?.country,
      phoneNumber: sellerData?.phoneNumber,
      joinDate: sellerData?.createdAt,
      isVerified: sellerData?.isVerified,
      profilePicture: sellerData?.profilePicture,
      sellerDetails: sellerData?.createdAt,
    } || {};


  const businessDetails =
    {
      businessType: sellerData?.businessType,
      businessName:
        sellerData?.businessType === 'Personal'
          ? `${sellerData?.firstName} ${sellerData?.lastName} `
          : sellerData?.businessType === 'Corporate'
          ? sellerData?.corporateBusinessAccount?.companyName
          : '',
      accountData:
        sellerData?.businessType === 'Personal'
          ? sellerData?.personalBusinessAccount
          : sellerData?.businessType === 'Corporate'
          ? sellerData?.corporateBusinessAccount
          : '',
    } || {};

  const bankDetails = data?.data?.body?.bankDetails || {};

  const items = [
    {
      key: '1',
      label: 'Personal Details',
    },
    {
      key: '2',
      label: 'Business Details',
    },
    {
      key: '3',
      label: 'Bank Details',
    },
  ];
  return (
    <DashboardLayout title="Seller" showBackBtn>
      <SellerWrapper>
        <Tabs
          className="tabs__custom"
          defaultActiveKey="1"
          items={items}
          onChange={(e) =>
            e === '1'
              ? setActiveTab('personal-details')
              : e === '2'
              ? setActiveTab('business-details')
              : setActiveTab('bank-details')
          }
        />

        {activeTab === 'personal-details' && (
          <PersonalDetails personalDetails={personalDetails} />
        )}
        {activeTab === 'business-details' && (
          <BusinessDetails businessDetails={businessDetails} />
        )}
        {activeTab === 'bank-details' && (
          <BankDetails bankDetails={bankDetails} />
        )}
      </SellerWrapper>
    </DashboardLayout>
  );
}
