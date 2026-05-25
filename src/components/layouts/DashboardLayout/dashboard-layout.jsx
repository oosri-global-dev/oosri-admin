import React, { useContext, useState, useMemo, useCallback } from "react";
import { DBWrapper } from "./dashboard-layout.styles";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { MainContext } from "@/context";
import { deleteDataInCookie } from "@/data-helpers/auth-session";
import Logo from "@/assets/images/logo-oosri.png";
import ProfileImage from "@/assets/images/profile.jpg";

import { DashboardOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { GoStack as ProductsIcon } from "react-icons/go";
import { GoPeople as SellersIcon } from "react-icons/go";
import { HiOutlineShoppingBag as OrdersIcon } from "react-icons/hi2";
import { HiOutlineBellAlert as NotificationIcon } from "react-icons/hi2";
import { VscGraph as AnalyticsIcon } from "react-icons/vsc";
import { BsPeopleFill as ProfileIcon, BsPeople as BuyersIcon } from "react-icons/bs";
import { IoMdLogOut as LogoutIcon } from "react-icons/io";
import { BsArrowLeft as BackIcon } from "react-icons/bs";
import { FiMenu as HamburgerIcon, FiX as CloseIcon } from "react-icons/fi";
import { TbCurrencyDollar as FxIcon } from "react-icons/tb";
import { MdOutlineCategory as CategoryIcon } from "react-icons/md";
import { RiListSettingsLine as AttributesIcon } from "react-icons/ri";
import { BiMoneyWithdraw as PayoutsIcon } from "react-icons/bi";
import { MdOutlineCreditCard as PaymentGwIcon } from "react-icons/md";
import { LuTruck as ShippingIcon } from "react-icons/lu";
import { MdOutlineMonitor as ApiStatusIcon } from "react-icons/md";
import { IoSettingsOutline as PlatformIcon } from "react-icons/io5";
import { Popover, Badge } from "antd";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationPanel from "@/components/lib/NotificationPanel";
import { usePermission } from "@/hooks/usePermission";
import { MdAdminPanelSettings as AdminsIcon } from "react-icons/md";
import { TbArrowBackUp as ReturnsIcon } from "react-icons/tb";
import { MdVerifiedUser as KycIcon } from "react-icons/md";
import { MdOutlineHistory as AuditLogIcon } from "react-icons/md";

const NAV_GROUPS = [
  {
    group: "Main",
    items: [
      { key: "/dashboard",       icon: DashboardOutlined, label: "Dashboard",  href: "/dashboard",      isAntd: true },
      { key: "/sales-analytics", icon: AnalyticsIcon,     label: "Analytics",  href: "/sales-analytics", permission: "analytics" },
    ],
  },
  {
    group: "Commerce",
    items: [
      { key: "/order",    icon: OrdersIcon,   label: "Orders",   href: "/order",    permission: "orders" },
      { key: "/products", icon: ProductsIcon, label: "Products", href: "/products", permission: "products" },
    ],
  },
  {
    group: "People",
    items: [
      { key: "/sellers", icon: SellersIcon, label: "Sellers", href: "/sellers", permission: "sellers" },
      { key: "/buyers",  icon: BuyersIcon,  label: "Buyers",  href: "/buyers",  permission: "buyers" },
      { key: "/kyc",     icon: KycIcon,     label: "KYC",     href: "/kyc",     permission: "kyc" },
    ],
  },
  {
    group: "Catalog",
    items: [
      { key: "/categories", icon: CategoryIcon,   label: "Categories", href: "/categories", permission: "categories" },
      { key: "/attributes", icon: AttributesIcon, label: "Attributes", href: "/attributes", permission: "attributes" },
    ],
  },
  {
    group: "Finance",
    items: [
      { key: "/payouts", icon: PayoutsIcon, label: "Payouts",       href: "/payouts",  permission: "payouts" },
      { key: "/fx-rate", icon: FxIcon,      label: "Exchange Rate", href: "/fx-rate",  permission: "fx" },
      { key: "/returns", icon: ReturnsIcon, label: "Returns",       href: "/returns",  permission: "returns" },
    ],
  },
  {
    group: "System",
    items: [
      { key: "/settings/payments",   icon: PaymentGwIcon, label: "Payment Gateways",   href: "/settings/payments",   permission: "settings" },
      { key: "/settings/shipping",   icon: ShippingIcon,  label: "Shipping Providers", href: "/settings/shipping",   permission: "settings" },
      { key: "/settings/api-status", icon: ApiStatusIcon, label: "API Status",         href: "/settings/api-status", permission: "settings" },
      { key: "/settings/platform",   icon: PlatformIcon,  label: "Platform Config",    href: "/settings/platform",   permission: "settings" },
    ],
  },
  {
    group: "Admin",
    items: [
      { key: "/admins",    icon: AdminsIcon,  label: "Manage Admins", href: "/admins",    superAdminOnly: true },
      { key: "/audit-log", icon: AuditLogIcon, label: "Audit Log",    href: "/audit-log", superAdminOnly: true },
    ],
  },
  {
    group: "Account",
    items: [
      { key: "/profile", icon: ProfileIcon, label: "Profile", href: "/admin-profile-page" },
    ],
  },
];

export default function DashboardLayout({ children, title, showBackBtn, titleSubText }) {
  const [collapsed, setCollapsed]     = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);
  const { push, pathname, back }      = useRouter();

  const { state: { user } = {} } = useContext(MainContext) || {};

  const { notifications, unreadCount, isLoading, markRead, markAllRead, remove } = useNotifications();
  const { hasPermission, isSuperAdmin } = usePermission();

  const visibleGroups = useMemo(() =>
    NAV_GROUPS
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (item.superAdminOnly) return isSuperAdmin;
          if (item.permission) return hasPermission(item.permission);
          return true;
        }),
      }))
      .filter((group) => group.items.length > 0),
  [user, isSuperAdmin, hasPermission]);

  const currentKey = useMemo(() => {
    if (pathname === "/" || pathname === "") return "/dashboard";
    if (pathname.startsWith("/settings/payments"))   return "/settings/payments";
    if (pathname.startsWith("/settings/shipping"))   return "/settings/shipping";
    if (pathname.startsWith("/settings/api-status")) return "/settings/api-status";
    if (pathname.startsWith("/settings/platform"))   return "/settings/platform";
    if (pathname.includes("/product"))               return "/products";
    if (pathname.includes("/order"))                 return "/order";
    if (pathname.includes("/sales") || pathname.includes("/analytics")) return "/sales-analytics";
    if (pathname.includes("/seller"))                return "/sellers";
    if (pathname.includes("/buyer"))                 return "/buyers";
    if (pathname.includes("/categor"))               return "/categories";
    if (pathname.includes("/attribute"))             return "/attributes";
    if (pathname.includes("/payout"))                return "/payouts";
    if (pathname.includes("/fx-rate"))               return "/fx-rate";
    if (pathname.includes("/return"))               return "/returns";
    if (pathname.includes("/kyc"))                  return "/kyc";
    if (pathname.includes("/audit-log"))              return "/audit-log";
    if (pathname.includes("/profile"))               return "/profile";
    if (pathname.includes("/admin"))                 return "/admins";
    return pathname;
  }, [pathname]);

  const handleLogout = useCallback(() => {
    deleteDataInCookie("access_token__admin");
    window.location.href = "/";
  }, []);

  const initials = useMemo(() => {
    if (!user?.fullName) return "A";
    const parts = user.fullName.trim().split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : parts[0][0].toUpperCase();
  }, [user]);

  const renderNavItem = ({ key, icon: Icon, label, href, isAntd }) => {
    const isActive = currentKey === key;
    return (
      <Link
        key={key}
        href={href}
        className={`nav__item${isActive ? " active" : ""}`}
        title={collapsed ? label : undefined}
        onClick={() => setMobileOpen(false)}
      >
        <span className="nav__icon">
          {isAntd ? <Icon style={{ fontSize: 16 }} /> : <Icon size={16} />}
        </span>
        <span className="nav__label">{label}</span>
      </Link>
    );
  };

  return (
    <DBWrapper $collapsed={collapsed} $mobileOpen={mobileOpen}>
      {/* Mobile overlay */}
      <div className="sidebar__overlay" onClick={() => setMobileOpen(false)} />

      {/* ── Sidebar ── */}
      <aside className="sidebar">

        {/* Logo row */}
        <div className="sidebar__logo">
          <Link href="/dashboard" className="logo__link">
            <Image src={Logo} alt="Oosri Admin" width={88} height={28} style={{ objectFit: "contain" }} />
          </Link>
          <button
            className="collapse__btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed
              ? <MenuUnfoldOutlined style={{ fontSize: 15 }} />
              : <MenuFoldOutlined  style={{ fontSize: 15 }} />}
          </button>
          <button
            className="mobile__close__btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          {visibleGroups.map(({ group, items }) => (
            <div className="nav__group" key={group}>
              <span className="nav__group__label">{group}</span>
              {items.map(renderNavItem)}
            </div>
          ))}
        </nav>

        {/* Footer: user + logout */}
        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="user__avatar">
              {user?.profilePicture
                ? <Image src={user.profilePicture} alt="profile" fill style={{ objectFit: "cover" }} />
                : <span className="avatar__initials">{initials}</span>}
            </div>
            <div className="user__info">
              <p className="user__name">{user?.fullName || "Admin"}</p>
              <span className="user__role">Administrator</span>
            </div>
          </div>
          <button
            className="logout__btn"
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
          >
            <LogoutIcon size={16} />
            <span className="nav__label">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="main__area">

        {/* Header */}
        <header className="top__header">
          <div className="header__left">
            <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
              <HamburgerIcon size={20} />
            </button>
            <div className="page__title__wrap">
              {showBackBtn && (
                <button className="back__btn" onClick={back}>
                  <BackIcon size={14} />
                </button>
              )}
              <div>
                <h1 className="page__title">{title || "Dashboard"}</h1>
                {titleSubText && <p className="page__sub">{titleSubText}</p>}
              </div>
            </div>
          </div>

          <div className="header__right">
            <Popover
              open={notifOpen}
              onOpenChange={setNotifOpen}
              trigger="click"
              placement="bottomRight"
              arrow={false}
              content={
                <NotificationPanel
                  notifications={notifications}
                  unreadCount={unreadCount}
                  isLoading={isLoading}
                  onRead={(id) => { markRead(id); }}
                  onMarkAllRead={() => { markAllRead(); }}
                  onDelete={(id) => { remove(id); }}
                />
              }
            >
              <div className="notif__wrap" style={{ cursor: 'pointer' }}>
                <Badge count={unreadCount} size="small" offset={[-2, 2]}>
                  <NotificationIcon size={18} />
                </Badge>
              </div>
            </Popover>
            <div className="profile__wrap">
              <div className="profile__avatar__wrap">
                {user?.profilePicture
                  ? <Image src={user.profilePicture} alt="profile" fill style={{ objectFit: "cover" }} />
                  : <span className="header__initials">{initials}</span>}
              </div>
              <div className="profile__details">
                {user?.fullName && <p className="profile__name">{user.fullName}</p>}
                <span className="profile__role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="content__area">
          {children}
        </main>

        {/* Footer */}
        <footer className="dashboard__footer">
          <p>© {new Date().getFullYear()} Oosri Global. All rights reserved.</p>
          <div className="footer__links">
            <a href="#">Help &amp; Support</a>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
          </div>
        </footer>
      </div>
    </DBWrapper>
  );
}
