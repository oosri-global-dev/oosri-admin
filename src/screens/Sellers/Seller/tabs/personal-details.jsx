import { FlexibleDiv } from '@/components/lib/Box/styles';
import { SellerWrapper } from '../seller.styles';
import HeaderTextAndSub from '@/screens/Products/Product/simple-components/simple-components';
import { formatISODateWithOrdinal } from '@/utils/format-date';

export default function PersonalDetails({ personalDetails }) {
  return (
    <SellerWrapper>
      <FlexibleDiv
        className="personal__details"
        flexDir="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <FlexibleDiv
          width="45%"
          flexDir="column"
          flexWrap="nowrap"
          justifyContent="flex-start"
          alignItems="flex-start"
          gap="40px"
          className="left__section"
        >
          <p className="title__text">Personal Information</p>
          <FlexibleDiv
            className="personal__info__content"
            flexDir="row"
            flexWrap="nowrap"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <FlexibleDiv width="60%" justifyContent="flex-start">
              <HeaderTextAndSub
                title="Full Legal Name"
                content={
                  personalDetails?.firstName + ' ' + personalDetails?.lastName
                }
              />
            </FlexibleDiv>
            <HeaderTextAndSub title="Sex" content="Male" />
          </FlexibleDiv>
          <FlexibleDiv
            className="personal__info__content"
            flexDir="row"
            flexWrap="nowrap"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <FlexibleDiv width="60%" justifyContent="flex-start">
              <HeaderTextAndSub
                title="Email Address"
                content={personalDetails?.email}
              />
            </FlexibleDiv>
            <HeaderTextAndSub title="Phone Number" content="+2347011046109" />
          </FlexibleDiv>
          <FlexibleDiv
            className="personal__info__content"
            flexDir="row"
            flexWrap="nowrap"
            justifyContent="flex-start"
            alignItems="flex-start"
            gap="50px"
          >
            <FlexibleDiv width="50%" justifyContent="flex-start">
              <HeaderTextAndSub
                title="Physical Address"
                content="123 Main Street, Suite 456 Anytown, CA 98765, United States"
              />
            </FlexibleDiv>
            <HeaderTextAndSub
              title="Date of Birth"
              content="14th, August 1995"
            />
          </FlexibleDiv>
          <FlexibleDiv
            className="personal__info__content"
            flexDir="row"
            flexWrap="nowrap"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <FlexibleDiv width="60%" justifyContent="flex-start">
              <HeaderTextAndSub
                title="Country"
                content={personalDetails?.country}
              />
            </FlexibleDiv>
            <HeaderTextAndSub
              title="Registration Date"
              content={formatISODateWithOrdinal(personalDetails?.joinDate)}
            />
          </FlexibleDiv>
        </FlexibleDiv>

        {/* right section */}
        <FlexibleDiv
          width="40%"
          flexDir="column"
          alignItems="flex-end"
          className="right__section"
          gap="10px"
        >
          <p className="status__text">
            Status:{' '}
            <span>
              {personalDetails?.isVerified ? 'Verified' : 'Unverified'}
            </span>
          </p>
          <img
            className="seller__image"
            src={personalDetails?.profilePicture}
            alt="seller"
          />
        </FlexibleDiv>
      </FlexibleDiv>
    </SellerWrapper>
  );
}
