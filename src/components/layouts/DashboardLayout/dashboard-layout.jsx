import { DBWrapper } from './dashboard-layout.styles';
import React, { useContext, useEffect, useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';
import { FlexibleDiv } from '@/components/lib/Box/styles';
import { CiSearch as SearchIcon } from 'react-icons/ci';
import { HiOutlineBellAlert as NotificationIcon } from 'react-icons/hi2';
import ProfileImage from '@/assets/images/profile.jpg';
import { IoMdLogOut as LogoutIcon } from 'react-icons/io';
import { HiOutlineShoppingBag as ProductIcon } from 'react-icons/hi2';
import { MdPayments as PaymentIcon } from 'react-icons/md';
import { VscGraph as GraphIcon } from 'react-icons/vsc';
import { BsPeopleFill } from 'react-icons/bs';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Button from '@/components/lib/Button';
import { FaWindowClose as CloseIcon } from 'react-icons/fa';
import { GoStack as StackIcon, GoPeople } from 'react-icons/go';
import { TbCurrencyDollar as FxIcon } from 'react-icons/tb';

const { Header, Sider, Content } = Layout;
import { BsArrowLeft as LeftArrow } from 'react-icons/bs';
import { MainContext } from '@/context';
import { isEmpty, isNull } from 'lodash';

export default function DashboardLayout({
  children,
  title,
  showBackBtn,
  titleSubText,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { push, pathname, back } = useRouter();
  const [current, setCurrent] = useState(
    pathname === '/' || pathname === ''
      ? '/dashboard'
      : pathname.includes('/product')
        ? '/products'
        : pathname.includes('/categories')
          ? '/categories'
          : pathname.includes('/order')
            ? '/order'
            : pathname.includes('/attributes')
              ? '/attributes'
              : pathname.includes('/fx-rate')
                ? '/fx-rate'
                : pathname
  );

  const {
    dispatch,
    state: { user, showNoBusinessModal } = {},
  } = useContext(MainContext) || {};

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => {
        push('/dashboard');
      },
    },
    {
      key: '/products',
      icon: <StackIcon />,
      label: 'Products',
      onClick: () => {
        push('/products');
      },
    },
    {
      key: '/categories',
      icon: <StackIcon />,
      label: 'Categories',
      onClick: () => {
        push('/categories');
      },
    },
    {
      key: '/sellers',
      icon: <GoPeople />,
      label: 'Sellers',
      onClick: () => {
        push('/sellers');
      },
    },
    {
      key: '/attributes',
      icon: <StackIcon />,
      label: 'Attributes',
      onClick: () => {
        push('/attributes');
      },
    },
    {
      key: '/order',
      icon: <ProductIcon />,
      label: 'Order',
      onClick: () => {
        push('/order');
      },
    },
    {
      key: '/sales-analytics',
      icon: <GraphIcon />,
      label: 'Sales Analytics',
      onClick: () => {
        push('/sales-analytics');
      },
    },
    {
      key: '/fx-rate',
      icon: <FxIcon size={18} />,
      label: 'Exchange Rate',
      onClick: () => {
        push('/fx-rate');
      },
    },
    {
      key: '/profile',
      icon: <BsPeopleFill />,
      label: 'Profile',
      onClick: ({ item, key }) => {
        push('/admin-profile-page');
      },
    },
    {
      key: '/',
      icon: <LogoutIcon />,
      label: 'Logout',
      onClick: ({ item, key }) => {
        push('/');
      },
    },
  ];

  return (
    <DBWrapper openMenu={collapsed}>
      <Layout className="layout__box">
        <Sider
          trigger={null}
          collapsible
          collapsed={false}
          className="sidebar__box"
        >
          <CloseIcon
            size={22}
            color="var(--oosriPrimary)"
            className="close__icon"
            onClick={() => setCollapsed(true)}
          />
          <Menu
            theme="light"
            mode="inline"
            className="menu__wrapper"
            items={menuItems}
            onClick={(e) => setCurrent(e.key)}
            selectedKeys={[current]}
          />
        </Sider>
        <Layout className="content__layout__wrapper">
          <Header className="header__box">
            <FlexibleDiv
              flexDir="row"
              justifyContent="space-between"
              className="header__auth__box"
            >
              <Button
                type="text"
                className="menu__btn"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
              />
              <FlexibleDiv
                flexDir="row"
                flexWrap="nowrap"
                width="fit-content"
                gap="15px"
              >
                {showBackBtn && (
                  <LeftArrow
                    size={24}
                    onClick={() => back()}
                    style={{ cursor: 'pointer' }}
                  />
                )}
                <FlexibleDiv flexDir="column" className="welcome__box">
                  <p className="dashboard__text">{title || 'Dashboard'}</p>
                  <p className="sub__text">
                    {!title && `Welcome, ${user?.fullName}!`}
                    {titleSubText}
                  </p>
                </FlexibleDiv>
              </FlexibleDiv>

              <FlexibleDiv className="header__navigations">
                <SearchIcon size={25} color="#9E9E9E" />
                <NotificationIcon size={25} color="#9E9E9E" />
                <FlexibleDiv
                  width="fit-content"
                  gap="8px"
                  className="profile__nav"
                >
                  <img
                    className="profile__image"
                    src={user?.profilePicture || ProfileImage.src}
                    alt="show-img"
                  />
                  <div>
                    {user?.fullName && <h4>{`${user?.fullName || ''}`}.</h4>}

                    <p>Admin</p>
                  </div>
                </FlexibleDiv>
              </FlexibleDiv>
            </FlexibleDiv>
          </Header>
          <Content
            className="layout__content__wrapper"
            style={{
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </DBWrapper>
  );
}
