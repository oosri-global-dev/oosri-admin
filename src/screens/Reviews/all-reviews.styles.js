import styled from "styled-components";

export const AllReviewsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  .section__header {
    .section__title { font-size: 1.1rem; font-weight: 700; color: #111827; margin: 0 0 4px; }
    .section__sub   { font-size: 0.82rem; color: #6b7280; margin: 0; }
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;

    .search__box {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 8px 14px;
      width: 280px;
      transition: border-color .15s;
      &:focus-within { border-color: var(--oosriPrimary); }
      input {
        border: none; outline: none;
        font-size: 0.84rem; color: #111827; width: 100%;
        font-family: inherit; background: transparent;
        &::placeholder { color: #9ca3af; }
      }
      svg { color: #9ca3af; flex-shrink: 0; }
    }

    .filter__tabs {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      button {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 7px 14px;
        font-size: 0.78rem;
        font-weight: 600;
        color: #6b7280;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.15s;
        text-transform: capitalize;
        &:hover { background: #f9fafb; }
        &.active { background: #111827; color: #fff; border-color: #111827; }
      }
    }
  }

  .table__card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
  }

  .review__snippet {
    font-size: 0.82rem;
    color: #374151;
    max-width: 260px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .status__pill {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.72rem; font-weight: 700;
    padding: 3px 10px; border-radius: 20px;
    .pill__dot { width: 6px; height: 6px; border-radius: 50%; }

    &.active  { background: #f0fdf4; color: #15803d; .pill__dot { background: #16a34a; } }
    &.flagged { background: #fffbeb; color: #b45309; .pill__dot { background: #f59e0b; } }
    &.hidden  { background: #f9fafb; color: #6b7280; .pill__dot { background: #9ca3af; } }
  }

  .stars__row {
    display: flex; gap: 2px;
  }

  .action__menu {
    display: flex; flex-direction: column; gap: 4px; min-width: 160px;
    .action__item {
      width: 100%; text-align: left; font-family: inherit;
      border: none; background: none;
      padding: 8px 12px; font-size: 0.82rem; cursor: pointer;
      border-radius: 6px; color: #374151; font-weight: 500;
      transition: background 0.12s;
      &:hover { background: #f3f4f6; }
      &.danger  { color: #dc2626; &:hover { background: #fef2f2; } }
      &.warn    { color: #b45309; &:hover { background: #fffbeb; } }
      &.success { color: #15803d; &:hover { background: #f0fdf4; } }
    }
  }

  .pagination__row {
    display: flex; justify-content: flex-end;
    padding: 16px 20px; border-top: 1px solid #f3f4f6;
  }

  .ant-table-thead > tr > th {
    background: #f8fafc !important;
    font-size: 0.75rem; font-weight: 600; color: #6b7280;
    text-transform: uppercase; letter-spacing: .04em;
    border-bottom: 1px solid #e2e8f0 !important;
  }
  .ant-table-tbody > tr > td {
    font-size: 0.84rem; color: #374151;
    border-bottom: 1px solid #f1f5f9 !important;
    padding: 12px 16px;
  }
  .ant-table-tbody > tr:hover > td { background: #fafbfc !important; }
`;
