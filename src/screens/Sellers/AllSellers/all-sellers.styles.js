import { FlexibleDiv } from "@/components/lib/Box/styles";
import styled from "styled-components";

export const AllSellersWrapper = styled(FlexibleDiv)`
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

  .products__table__section {
    border: 1px solid rgba(224, 224, 224, 0.6);
    border-radius: 8px;
    box-sizing: border-box;

    .search__body__section {
      box-sizing: border-box;
      padding: 25px 20px;

      .search__section {
        width: fit-content;

        .text__field__custom {
          border: 1px solid rgba(224, 224, 224, 0.6);
          width: 300px;
          margin-left: 8px;
        }
      }

      .filter__btn__custom {
        display: flex;
        gap: 5px;
        align-items: center;
        justify-content: center;
      }
    }

    .table__class {
      width: 100%;

      .verified__text {
        color: #55d352;
        border: 1px solid #55d352;
        border-radius: 15px;
        padding: 5px 10px;
        font-size: 1rem;
      }
      .unverified__text {
        color: #FC5353;
        border: 1px solid #FC5353;
        border-radius: 15px;
        padding: 5px 10px;
        font-size: 1rem;
      }
    }
  }
`;
