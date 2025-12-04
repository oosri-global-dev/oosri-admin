import { FlexibleDiv } from '@/components/lib/Box/styles';
import { SellerWrapper } from '../seller.styles';
import HeaderTextAndSub from '@/screens/Products/Product/simple-components/simple-components';
import GovVerification from '@/assets/images/profile.jpg';

export default function BusinessDetails({ businessDetails }) {
  console.log('BUSINESS DETAILS', businessDetails);
  return (
    <SellerWrapper>
      <FlexibleDiv
        className="business__details"
        flexDir="column"
        alignItems="flex-start"
      >
        <p className="title__text">Business Information</p>
        <FlexibleDiv flexDir="row" gap="25px" justifyContent="flex-start">
          <HeaderTextAndSub
            title="Business Name"
            content={businessDetails?.businessName}
          />
          <HeaderTextAndSub
            title="Business Type"
            content={businessDetails?.businessType}
          />
        </FlexibleDiv>
        <FlexibleDiv flexDir="row" gap="30px" justifyContent="flex-start">
          <HeaderTextAndSub
            title="Business Registration Number"
            content={businessDetails?.accountData?.companyRegNum || "-"}
          />
          <HeaderTextAndSub
            title="Business Address"
            content={businessDetails?.accountData?.companyAddress || "-"}
          />
        </FlexibleDiv>
        <HeaderTextAndSub
          title="Business Description"
          content={businessDetails?.accountData?.companyDescription || "-"}
        />
        <FlexibleDiv
          className="gov__identification"
          flexDir="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          gap="10px"
        >
          <HeaderTextAndSub title="Government Identification" />
          <div className="img__wrapper">
            <img
              src={businessDetails?.profileImage}
              alt="government-identification"
            />
          </div>
        </FlexibleDiv>
        <FlexibleDiv
          className="gov__identification"
          flexDir="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          gap="10px"
        >
          <HeaderTextAndSub title="Business Registration Certificate" />
          <div className="img__wrapper">
            <img
              src={businessDetails?.accountData?.companyCertificate}
              alt="government-identification"
            />
          </div>
        </FlexibleDiv>
      </FlexibleDiv>
    </SellerWrapper>
  );
}
