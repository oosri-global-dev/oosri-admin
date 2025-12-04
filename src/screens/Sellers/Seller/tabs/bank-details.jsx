import { FlexibleDiv } from '@/components/lib/Box/styles';
import { SellerWrapper } from '../seller.styles';
import HeaderTextAndSub from '@/screens/Products/Product/simple-components/simple-components';

export default function BankDetails({ bankDetails }) {
  return (
    <SellerWrapper>
      <FlexibleDiv
        className="bank__details"
        flexDir="column"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <p className="title__text">Bank Information</p>
        <FlexibleDiv
          flexDir="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          gap="21%"
          flexWrap="nowrap"
        >
          <HeaderTextAndSub
            title="Account Name"
            content={bankDetails?.accountName}
          />
          <HeaderTextAndSub title="Bank" content={bankDetails?.bank} />
          <HeaderTextAndSub />
        </FlexibleDiv>
        <FlexibleDiv
          flexDir="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          gap="20%"
          flexWrap="nowrap"
        >
          <HeaderTextAndSub
            title="Account Number"
            content={bankDetails?.accountNumber}
          />
          <HeaderTextAndSub
            title="National Identification Number"
            content="73743930943084302420"
          />
          <HeaderTextAndSub />
        </FlexibleDiv>
      </FlexibleDiv>
    </SellerWrapper>
  );
}
