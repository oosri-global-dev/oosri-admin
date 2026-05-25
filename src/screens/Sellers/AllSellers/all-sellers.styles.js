import styled from "styled-components";

export const AllSellersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;

  .screen__card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
  }

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
    transition: border-color 0.15s, box-shadow 0.15s;

    &:focus-within {
      border-color: var(--oosriPrimary);
      background: #fff;
      box-shadow: 0 0 0 3px rgba(252, 83, 83, 0.1);
    }

    input {
      border: none;
      outline: none;
      background: transparent;
      font-size: 0.83rem;
      color: #111827;
      width: 100%;

      &::placeholder { color: #9ca3af; }
    }

    svg { color: #9ca3af; flex-shrink: 0; }
  }

  .status__tabs {
    display: flex;
    gap: 4px;

    button {
      height: 32px;
      padding: 0 14px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background: #fff;
      font-size: 0.8rem;
      font-weight: 500;
      color: #6b7280;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s;

      &:hover { border-color: var(--oosriPrimary); color: var(--oosriPrimary); }
      &.active {
        background: var(--oosriPrimary);
        border-color: var(--oosriPrimary);
        color: #fff;
      }
    }
  }

  /* tab bar */
  .tab__bar {
    display: flex;
    gap: 0;
    border-bottom: 1px solid #e2e8f0;
    padding: 0 20px;
  }

  .tab__btn {
    height: 42px;
    padding: 0 16px;
    border: none;
    border-bottom: 2px solid transparent;
    background: none;
    font-size: 0.83rem;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    font-family: inherit;
    transition: color 0.15s, border-color 0.15s;
    margin-bottom: -1px;

    &:hover { color: var(--oosriPrimary); }
    &.active {
      color: var(--oosriPrimary);
      border-bottom-color: var(--oosriPrimary);
      font-weight: 600;
    }
  }

  /* status pills */
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    &.verified   { background: #f0fdf4; color: #16a34a; .dot { background: #16a34a; } }
    &.unverified { background: #fff7ed; color: #b45309; .dot { background: #f59e0b; } }
    &.suspended  { background: #fee2e2; color: #dc2626; .dot { background: #dc2626; } }
  }

  /* seller name cell */
  .seller__cell {
    display: flex;
    align-items: center;
    gap: 10px;

    .avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #f1f5f9;
      color: #475569;
      font-size: 0.72rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .name { font-size: 0.85rem; font-weight: 600; color: #111827; }
    .email { font-size: 0.78rem; color: #6b7280; }
  }

  /* popover action menu */
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
      font-size: 0.82rem;
      color: #374151;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.1s;

      &:hover { background: #f1f5f9; }
    }
  }

  /* AntD overrides */
  .ant-table-thead > tr > th {
    background: #f8fafc !important;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    border-bottom: 1px solid #e2e8f0 !important;
  }

  .ant-table-tbody > tr > td {
    font-size: 0.84rem;
    color: #374151;
    border-bottom: 1px solid #f1f5f9 !important;
    padding: 12px 16px;
  }

  .ant-table-tbody > tr:hover > td {
    background: #fafbfc !important;
  }

`;
