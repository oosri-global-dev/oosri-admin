import styled from 'styled-components';

export const AllCategoriesWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .categories__table__section {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    border-radius: 10px;
    padding: 20px;
    gap: 20px;
  }

  .search__body__section {
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 20px;
  }

  .search__section {
    display: flex;
    flex-direction: row;
    width: 30%;
    height: 40px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 0 10px;
    justify-content: space-between;
    gap: 10px;
  }

  .text__field__custom {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    font-size: 14px;
    color: #000000;

    &::placeholder {
      color: #9e9e9e;
    }
  }

  .categories__table__wrapper {
    width: 100%;
    overflow-x: auto;
  }

  .popover__custom {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    width: 150px;
  }
`;
