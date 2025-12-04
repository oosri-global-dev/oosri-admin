import { FlexibleDiv } from "@/components/lib/Box/styles";
import styled from "styled-components";

export const DBWrapper = styled(FlexibleDiv)`
  box-sizing: border-box;

  .layout__box {
    height: 100dvh;

    .sidebar__box {
      background: white;
      border-right: 1px solid #cfcfcf;

      .close__icon {
        display: none;
      }
    }

    .menu__wrapper {
      margin-top: 100px;

      .ant-menu-item {
        color: #777;
      }

      .ant-menu-item-selected {
        background-color: rgba(254, 221, 221, 0.6);
        color: var(--oosriPrimary);
        border-right: 3px solid #fc5353;
        border-radius: 0px 5px 5px 0px;
      }
    }

    .content__layout__wrapper {
      flex-direction: column;
      flex-wrap: nowrap;
      position: relative;
      display: flex;
      box-sizing: border-box;

      .header__box {
        background: white;
        padding: 0;
        z-index: 1;
        height: fit-content;
        box-sizing: border-box;
        padding: 30px;
        border: 1px solid #bbbbbb4d;

        .header__auth__box {
          width: 100%;
          background: transparent;
          line-height: normal;
          flex-wrap: nowrap;

          .menu__btn {
            display: none;
          }

          .welcome__box {
            height: fit-content;
            width: fit-content;
            justify-content: flex-start;

            p {
              width: 100%;
            }

            .dashboard__text {
              font-size: 2.2rem;
            }

            .sub__text {
              font-size: 1rem;
              color: #999;
              margin-top: 5px;
            }
          }

          .header__navigations {
            width: fit-content;
            gap: 30px;

            .profile__image {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              object-fit: cover;
            }
          }
        }
      }

      .layout__content__wrapper {
        position: relative;
        z-index: 1;
        background: white;
        height: 100%;
        overflow-y: auto;
      }
    }
  }

  .logo_wrapper {
    margin-top: 120px;
    cursor: pointer;
    svg {
      path {
        fill: #f45059;
      }
    }

    color: #f45059;
  }

  @media (max-width: 660px) {
    .layout__box {
      .menu__wrapper {
        border: none;
        margin-top: 100px;
      }

      .sidebar__box {
        position: fixed;
        left: 10px;
        top: 0;
        bottom: 0;
        transition: all 0.5s ease;
        display: ${({ openMenu }) => (openMenu ? "flex" : "flex")};
        transform: ${({ openMenu }) =>
          openMenu ? "translateX(-100vw)" : "translateX(-10px)"};
        z-index: 10;
        padding: 10px;
        width: 100% !important;

        .close__icon {
          display: block;
          position: absolute;
          right: 25px;
          top: 25px;
        }
      }

      .layout__content__wrapper {
        padding: 10px !important;
        pointer-events: ${({ openMenu }) => (openMenu ? "auto" : "none")};
      }

      .content__layout__wrapper {
        .header__box {
          padding: 20px 10px;
          border-bottom: 1px dotted var(--oosriPrimary);

          .header__auth__box {
            flex-direction: row-reverse;
            justify-content: space-between;
            gap: 15px;

            .menu__btn {
              display: block;
              svg {
                font-size: 18px;
              }
            }

            .welcome__box {
              .dashboard__text {
                font-size: 1.8rem !important;
              }

              .sub__text {
                font-size: 0.9rem !important;
              }
            }
          }

          .header__navigations {
            display: none;
          }
        }

        .layout__content__wrapper {
          width: 100%;
        }
      }
    }
  }
`;

export const LogoutButton=styled.button`
  display:flex;
  align-items:center;
  margin-top:120px;
  cursor:pointer;
  padding:0px 30px ;
  color:#F45059;
  gap:10px;
  background-color:transparent;
  border:none;
  font-size:14px;
  width:100%;

    svg{
     path{
      fill:#F45059;
     }
    }

`