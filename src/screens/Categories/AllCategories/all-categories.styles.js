import styled from 'styled-components';

export const AllCategoriesWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .categories__table__section {
    width: 100%;
    background-color: #ffffff;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .search__body__section {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 16px;
    flex-wrap: wrap;
  }

  .search__section {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    max-width: 400px;
    height: 44px;
    background: #FAFAFA;
    border: 1px solid #E0E0E0;
    border-radius: 10px;
    padding: 0 14px;
    gap: 10px;
    transition: all 0.3s ease;

    &:focus-within {
      border-color: var(--oosriPrimary);
      background: #FFFFFF;
      box-shadow: 0 0 0 2px rgba(252, 83, 83, 0.1);
    }
  }

  .text__field__custom {
    flex: 1;
    height: 100% !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    font-size: 14px;
    color: #212121;

    &:focus {
      border: none !important;
      box-shadow: none !important;
    }

    &::placeholder {
      color: #9E9E9E;
    }
  }

  .categories__table__wrapper {
    width: 100%;
    
    .ant-table {
        border-radius: 8px;
        overflow: hidden;
    }
    
    .ant-table-thead > tr > th {
        background: #F8F9FA;
        font-weight: 600;
        color: #4A4A4A;
    }
  }

  .popover__custom {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 4px;
    width: 160px;
  }
`;
