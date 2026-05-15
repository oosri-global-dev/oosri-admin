import styled from "styled-components";

export const AllProductsWrapper = styled.div`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid #f1f5f9;
    flex-wrap: wrap;
  }

  .search__box {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 38px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0 12px;
    background: #f8fafc;
    width: 280px;
    transition: border-color .15s, box-shadow .15s;
    &:focus-within {
      border-color: var(--oosriPrimary);
      background: #fff;
      box-shadow: 0 0 0 3px rgba(252,83,83,.1);
    }
    input {
      border: none; outline: none; background: transparent;
      font-size: .83rem; color: #111827; width: 100%; font-family: inherit;
      &::placeholder { color: #9ca3af; }
    }
    svg { color: #9ca3af; flex-shrink: 0; }
  }

  .sort__select {
    display: flex;
    align-items: center;
    gap: 8px;

    label { font-size: .8rem; color: #6b7280; font-weight: 500; }
  }

  /* product name cell */
  .product__cell {
    display: flex;
    align-items: center;
    gap: 10px;

    .product__thumb {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      object-fit: cover;
      background: #f1f5f9;
      flex-shrink: 0;
    }

    .product__thumb__placeholder {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      background: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
      flex-shrink: 0;
    }

    .product__name { font-size: .84rem; font-weight: 600; color: #111827; }
  }

  /* stock pill */
  .stock__pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: .74rem;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 20px;
    &.in    { background: #f0fdf4; color: #16a34a; }
    &.out   { background: #fff1f2; color: #be123c; }
  }

  /* action popover */
  .action__menu {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 160px;
    padding: 4px;
    button {
      width: 100%;
      text-align: left;
      padding: 7px 10px;
      border-radius: 6px;
      border: none;
      background: none;
      font-size: .82rem;
      color: #374151;
      cursor: pointer;
      font-family: inherit;
      transition: background .1s;
      &:hover { background: #f1f5f9; }
    }
  }

  /* AntD overrides */
  .ant-table-thead > tr > th {
    background: #f8fafc !important;
    font-size: .75rem; font-weight: 600; color: #6b7280;
    text-transform: uppercase; letter-spacing: .04em;
    border-bottom: 1px solid #e2e8f0 !important;
  }
  .ant-table-tbody > tr > td {
    font-size: .84rem; color: #374151;
    border-bottom: 1px solid #f1f5f9 !important;
    padding: 12px 16px;
  }
  .ant-table-tbody > tr:hover > td { background: #fafbfc !important; }
  .ant-pagination { padding: 12px 20px; display: flex; justify-content: flex-end; }

  .ant-select .ant-select-selector {
    border-color: #e2e8f0 !important;
    background: #f8fafc !important;
    border-radius: 8px !important;
    font-size: .83rem;
  }

  @media (max-width: 640px) {
    .toolbar { flex-direction: column; align-items: flex-start; }
    .search__box { width: 100%; }
  }
`;
