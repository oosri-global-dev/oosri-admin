import styled from "styled-components";

export const OrderWrapper = styled.div`
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

  .toolbar__right {
    display: flex;
    align-items: center;
    gap: 8px;
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

    .dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

    &.delivered    { background: #f0fdf4; color: #16a34a; .dot { background: #16a34a; } }
    &.processing   { background: #fffbeb; color: #b45309; .dot { background: #f59e0b; } }
    &.pickup       { background: #eff6ff; color: #1d4ed8; .dot { background: #3b82f6; } }
    &.cancelled    { background: #fff1f2; color: #be123c; .dot { background: #fc5353; } }
    &.paid         { background: #f0fdf4; color: #16a34a; .dot { background: #16a34a; } }
    &.pending      { background: #fffbeb; color: #b45309; .dot { background: #f59e0b; } }
  }

  .amount__cell {
    font-weight: 600;
    color: #111827;
  }

  .ref__cell {
    font-family: monospace;
    font-size: 0.8rem;
    color: #6b7280;
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

  .ant-table-tbody > tr:hover > td { background: #fafbfc !important; }

  .ant-select .ant-select-selector {
    border-color: #e2e8f0 !important;
    background: #f8fafc !important;
    border-radius: 8px !important;
    font-size: 0.83rem;
  }
`;
