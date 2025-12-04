import DashboardLayout from '@/components/layouts/DashboardLayout/dashboard-layout';
import { AllSellersWrapper } from './all-sellers.styles';
import { useState, useEffect } from 'react';
import { Tabs, Table } from 'antd';
import { FlexibleDiv } from '@/components/lib/Box/styles';
import { IoSearchOutline as SearchIcon } from 'react-icons/io5';
import TextField from '@/components/lib/TextField';
import { LuArrowUpDown as FilterArrow } from 'react-icons/lu';
import Button from '@/components/lib/Button';
import { useSellers } from '@/hooks/useSellers';
import AllSellersTab from './tabs/all-sellers/all-sellers-tab';
import UnVerifiedSellersTab from './tabs/unverified-sellers/unverified-sellers-tab';

export default function AllSellers() {
  const [activeTab, setActiveTab] = useState('all-sellers');
  const [searchTerm, setSearchTerm] = useState();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const isUnverifiedTab = activeTab === 'unverified-sellers';
  const isSearching = debouncedSearchTerm?.trim() !== '';

  const shouldGetAllSellers = isUnverifiedTab && !isSearching;

  const { data, isLoading, error } = useSellers(
    debouncedSearchTerm,
    shouldGetAllSellers
  );

  console.log('SELLERS DATA', data);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const fetchedSellers = data?.sellers || [];
  const allSellers = !isUnverifiedTab ? fetchedSellers : [];

  const unverifiedSellers = isUnverifiedTab
    ? fetchedSellers.filter((seller) => seller?.isVerified === false)
    : [];

  console.log('UNVERIFIED SELLERS', unverifiedSellers);

  const items = [
    {
      key: '1',
      label: 'All Sellers',
    },
    {
      key: '2',
      label: 'Unverified Sellers',
    },
  ];

  return (
    <AllSellersWrapper>
      <Tabs
        className="tabs__custom"
        defaultActiveKey="1"
        items={items}
        onChange={(e) =>
          e === '1'
            ? setActiveTab('all-sellers')
            : setActiveTab('unverified-sellers')
        }
      />

      {/* sellers content */}
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
              placeholder="Search sellers"
              autoComplete="new-password"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FlexibleDiv>
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
        </FlexibleDiv>

        <FlexibleDiv className="products__table__wrapper">
          {activeTab === 'all-sellers' && (
            <AllSellersTab
              sellers={allSellers}
              loading={isLoading}
              error={error}
            />
          )}
          {activeTab === 'unverified-sellers' && (
            <UnVerifiedSellersTab
              sellers={unverifiedSellers}
              loading={isLoading}
              error={error}
            />
          )}
        </FlexibleDiv>
      </FlexibleDiv>
    </AllSellersWrapper>
  );
}
