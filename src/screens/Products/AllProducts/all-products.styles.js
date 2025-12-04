import { FlexibleDiv } from "@/components/lib/Box/styles";
import styled from "styled-components";

export const TopMenuWrapper = styled(FlexibleDiv)`
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
`;

export const AllProductsWrapper = styled(FlexibleDiv)`
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
      }
      
      .popover__custom {
        padding: 0px;
    }
  }

    .ant-table{
        overflow-x: auto !important;
        width:100% !important;
    }

  @media (max-width: 550px) {
    .products__table__section {
      .search__body__section {
        padding: 15px 0px;
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }

      .products__table__wrapper {
        overflow-x: auto;
        width:100%;
      }
    }
  }
`;
