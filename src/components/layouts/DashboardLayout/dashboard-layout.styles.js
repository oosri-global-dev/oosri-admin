import styled from "styled-components";

const SIDEBAR_WIDE      = 252;
const SIDEBAR_COLLAPSED = 72;

export const DBWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100dvh;
  background: #f4f6f9;
  overflow: hidden;
  box-sizing: border-box;

  /* ─────────────────────────────────────────────
     SIDEBAR
  ───────────────────────────────────────────── */
  .sidebar {
    width: ${({ $collapsed }) => $collapsed ? `${SIDEBAR_COLLAPSED}px` : `${SIDEBAR_WIDE}px`};
    background: #111827;
    height: 100dvh;
    position: sticky;
    top: 0;
    flex-shrink: 0;
    transition: width 0.25s ease;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    z-index: 10;
  }

  /* Logo row */
  .sidebar__logo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 ${({ $collapsed }) => $collapsed ? "0" : "16px"};
    height: 64px;
    min-height: 64px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    flex-shrink: 0;

    .logo__link {
      display: flex;
      align-items: center;
      overflow: hidden;
      opacity: ${({ $collapsed }) => $collapsed ? 0 : 1};
      max-width: ${({ $collapsed }) => $collapsed ? "0" : "130px"};
      transition: opacity 0.2s ease, max-width 0.25s ease;
    }

    .collapse__btn {
      background: none;
      border: none;
      cursor: pointer;
      color: rgba(255,255,255,0.4);
      width: ${({ $collapsed }) => $collapsed ? `${SIDEBAR_COLLAPSED}px` : "auto"};
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      border-radius: 6px;
      flex-shrink: 0;
      transition: color 0.15s;
      &:hover { color: rgba(255,255,255,0.85); }
    }

    .mobile__close__btn { display: none; }
  }

  /* Nav scroll */
  .sidebar__nav {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 4px 0;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }

  /* Group */
  .nav__group {
    padding: 10px 0 4px;

    .nav__group__label {
      display: ${({ $collapsed }) => $collapsed ? "none" : "block"};
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: rgba(255,255,255,0.25);
      padding: 0 16px 4px;
      text-transform: uppercase;
    }
  }

  /* Nav item */
  .nav__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px ${({ $collapsed }) => $collapsed ? "0" : "12px"};
    margin: 1px 8px;
    border-radius: 8px;
    color: rgba(255,255,255,0.5);
    text-decoration: none;
    transition: background 0.15s, color 0.15s;
    justify-content: ${({ $collapsed }) => $collapsed ? "center" : "flex-start"};

    &:hover {
      background: rgba(255,255,255,0.07);
      color: rgba(255,255,255,0.9);
    }

    &.active {
      background: rgba(252,83,83,0.15);
      color: var(--oosriPrimary);
      font-weight: 600;
    }

    .nav__icon {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      font-size: 16px;
    }

    .nav__label {
      font-size: 0.84rem;
      white-space: nowrap;
      display: ${({ $collapsed }) => $collapsed ? "none" : "block"};
    }
  }

  /* Sidebar footer */
  .sidebar__footer {
    border-top: 1px solid rgba(255,255,255,0.07);
    padding: 10px 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex-shrink: 0;
  }

  .sidebar__user {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border-radius: 8px;
    overflow: hidden;

    .user__avatar {
      position: relative;
      width: 32px;
      height: 32px;
      min-width: 32px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      background: rgba(252,83,83,0.25);
      display: flex;
      align-items: center;
      justify-content: center;

      .avatar__initials {
        color: var(--oosriPrimary);
        font-size: 0.72rem;
        font-weight: 700;
      }
    }

    .user__info {
      display: ${({ $collapsed }) => $collapsed ? "none" : "flex"};
      flex-direction: column;
      gap: 1px;
      min-width: 0;

      .user__name {
        color: #fff;
        font-size: 0.82rem;
        font-weight: 600;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .user__role {
        color: rgba(255,255,255,0.4);
        font-size: 0.68rem;
      }
    }
  }

  .logout__btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px ${({ $collapsed }) => $collapsed ? "0" : "12px"};
    border-radius: 8px;
    background: none;
    border: none;
    color: rgba(255,255,255,0.4);
    cursor: pointer;
    width: 100%;
    justify-content: ${({ $collapsed }) => $collapsed ? "center" : "flex-start"};
    transition: background 0.15s, color 0.15s;
    font-family: inherit;
    font-size: 0.84rem;

    &:hover {
      background: rgba(252,83,83,0.12);
      color: var(--oosriPrimary);
    }

    .nav__label {
      display: ${({ $collapsed }) => $collapsed ? "none" : "block"};
    }
  }

  /* Mobile overlay */
  .sidebar__overlay { display: none; }

  /* ─────────────────────────────────────────────
     MAIN AREA
  ───────────────────────────────────────────── */
  .main__area {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    height: 100dvh;
    overflow-y: auto;
  }

  /* ─────────────────────────────────────────────
     HEADER
  ───────────────────────────────────────────── */
  .top__header {
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
    height: 64px;
    min-height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    position: sticky;
    top: 0;
    z-index: 5;
    gap: 12px;
    flex-shrink: 0;

    .header__left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      min-width: 0;

      .hamburger {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        color: #555;
        padding: 7px;
        border-radius: 7px;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        transition: background 0.15s;
        &:hover { background: #f5f5f5; }
      }

      .page__title__wrap {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;

        .back__btn {
          background: none;
          border: 1px solid #e8e8e8;
          border-radius: 7px;
          padding: 5px 8px;
          cursor: pointer;
          color: #666;
          display: flex;
          align-items: center;
          flex-shrink: 0;
          transition: background 0.15s;
          &:hover { background: #f5f5f5; }
        }

        .page__title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .page__sub {
          font-size: 0.74rem;
          color: #aaa;
          margin: 1px 0 0;
          white-space: nowrap;
        }
      }
    }

    .header__right {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;

      .notif__wrap {
        position: relative;
        width: 36px;
        height: 36px;
        border-radius: 8px;
        border: 1px solid #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #888;
        transition: background 0.15s, color 0.15s;
        flex-shrink: 0;
        &:hover { background: #f9f9f9; color: #444; }
      }

      .profile__wrap {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 5px 10px 5px 5px;
        border-radius: 8px;
        border: 1px solid #f0f0f0;
        transition: background 0.15s;
        flex-shrink: 0;
        &:hover { background: #f9f9f9; }

        .profile__avatar__wrap {
          position: relative;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          overflow: hidden;
          background: rgba(252,83,83,0.12);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;

          .header__initials {
            color: var(--oosriPrimary);
            font-size: 0.68rem;
            font-weight: 700;
          }
        }

        .profile__details {
          .profile__name {
            font-size: 0.8rem;
            font-weight: 600;
            color: #1a1a1a;
            margin: 0;
            white-space: nowrap;
          }
          .profile__role {
            font-size: 0.67rem;
            color: #aaa;
            display: block;
          }
        }
      }
    }
  }

  /* ─────────────────────────────────────────────
     CONTENT
  ───────────────────────────────────────────── */
  .content__area {
    flex: 1;
    padding: 24px;
  }

  /* ─────────────────────────────────────────────
     FOOTER
  ───────────────────────────────────────────── */
  .dashboard__footer {
    padding: 14px 24px;
    border-top: 1px solid #efefef;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    background: #fff;
    flex-shrink: 0;

    p {
      font-size: 0.74rem;
      color: #ccc;
      margin: 0;
    }

    .footer__links {
      display: flex;
      gap: 16px;

      a {
        font-size: 0.74rem;
        color: #ccc;
        text-decoration: none;
        transition: color 0.15s;
        &:hover { color: var(--oosriPrimary); }
      }
    }
  }

  /* ─────────────────────────────────────────────
     MOBILE  (≤ 768px)
  ───────────────────────────────────────────── */
  @media (max-width: 768px) {
    .sidebar {
      position: fixed;
      left: 0; top: 0; bottom: 0;
      width: ${SIDEBAR_WIDE}px !important;
      transform: ${({ $mobileOpen }) => $mobileOpen ? "translateX(0)" : "translateX(-100%)"};
      transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
      z-index: 200;

      .nav__item         { justify-content: flex-start; padding: 9px 12px; }
      .nav__label        { display: block !important; }
      .nav__group__label { display: block !important; }
      .user__info        { display: flex !important; }
      .logout__btn       { justify-content: flex-start; padding: 9px 12px; .nav__label { display: block !important; } }
      .sidebar__logo     { padding: 0 16px !important; }
      .sidebar__logo .logo__link { opacity: 1 !important; max-width: 130px !important; }
      .collapse__btn     { display: none; }

      .mobile__close__btn {
        display: flex;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        cursor: pointer;
        color: rgba(255,255,255,0.45);
        padding: 7px;
        border-radius: 7px;
        flex-shrink: 0;
        transition: color 0.15s, background 0.15s;
        &:hover { color: #fff; background: rgba(255,255,255,0.08); }
      }
    }

    .sidebar__overlay {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 199;
      opacity: ${({ $mobileOpen }) => $mobileOpen ? 1 : 0};
      pointer-events: ${({ $mobileOpen }) => $mobileOpen ? "auto" : "none"};
      transition: opacity 0.28s ease;
    }

    .top__header {
      padding: 0 16px;
      z-index: 50;
      .header__left .hamburger { display: flex; }
      .profile__wrap .profile__details { display: none; }
    }

    .content__area { padding: 16px; }

    .dashboard__footer {
      padding: 12px 16px;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
  }
`;
