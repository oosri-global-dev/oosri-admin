import { FlexibleDiv } from "@/components/lib/Box/styles";
import styled from "styled-components";

export const SellerWrapper = styled(FlexibleDiv)`
  justify-content: flex-start;
  .tabs__custom {
    width: 100%;
    margin-bottom: 15px;

    .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
      color: var(--oosriPrimary) !important;
    }

    .ant-tabs-ink-bar {
      background: var(--oosriPrimary);
    }
  }

  .title__text {
    font-size: 2rem;
  }

  .personal__details {
    border: 0.8px solid #e0e0e099;
    border-radius: 10px;
    padding: 35px 25px;

    .left__section {
      .personal__info__content {
      }
    }

    .right__section {
      .status__text {
        font-size: 0.9rem;
        color: #bbbbbb;

        span {
          color: #55d352;
        }
      }

      .seller__image {
        width: 250px;
        max-height: 300px;
        object-fit: cover;
        border-radius: 10px;
      }
    }

    @media (max-width: 550px) {
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      flex-direction: column-reverse;
      padding: 20px 10px;
      gap: 25px;

      .left__section {
        width: 100%;
      }

      .right__section {
        width: 100%;
        align-items: flex-start;
      }
    }
  }

  .business__details {
    border: 0.8px solid #e0e0e099;
    border-radius: 10px;
    padding: 35px 25px;
    gap: 35px;
    max-width: 70%;

    .gov__identification {
      max-height: 340px;

      .img__wrapper {
        width: 100%;
        height: 250px;
        background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23333' stroke-width='4' stroke-dasharray='12' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
        padding: 10px;
        display: flex;
        justify-content: center;

        img {
          height: 100%;
          max-width: 100%;
        }
      }
    }

    @media (max-width: 550px) {
      width: 100%;
      max-width: 100%;
    }
  }

  .bank__details {
    border: 0.8px solid #e0e0e099;
    border-radius: 10px;
    padding: 35px 25px;
    gap: 35px;
  }
`;
