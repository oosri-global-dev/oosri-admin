import styled from "styled-components";

export const AllReturnsWrapper = styled.div`
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

  /* status pills */
  .status__pill {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.72rem; font-weight: 700;
    padding: 3px 10px; border-radius: 20px;
    .pill__dot { width: 6px; height: 6px; border-radius: 50%; }

    &.pending         { background: #fffbeb; color: #b45309; .pill__dot { background: #f59e0b; } }
    &.seller_approved { background: #f0fdf4; color: #15803d; .pill__dot { background: #16a34a; } }
    &.seller_rejected { background: #fef2f2; color: #b91c1c; .pill__dot { background: #dc2626; } }
    &.escalated       { background: #fef3c7; color: #92400e; .pill__dot { background: #f59e0b; } }
    &.admin_approved  { background: #eff6ff; color: #1d4ed8; .pill__dot { background: #3b82f6; } }
    &.admin_rejected  { background: #fef2f2; color: #b91c1c; .pill__dot { background: #dc2626; } }
    &.refund_initiated { background: #f5f3ff; color: #6d28d9; .pill__dot { background: #7c3aed; } }
    &.refunded        { background: #f0fdf4; color: #15803d; .pill__dot { background: #16a34a; } }
    &.closed          { background: #f9fafb; color: #6b7280; .pill__dot { background: #9ca3af; } }
  }

  .reason__badge {
    display: inline-block;
    background: #f3f4f6;
    color: #374151;
    font-size: 0.72rem;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 6px;
    text-transform: capitalize;
  }

  .action__menu {
    display: flex; flex-direction: column; gap: 4px; min-width: 160px;
    .action__item {
      padding: 8px 12px; font-size: 0.82rem; cursor: pointer;
      border-radius: 6px; color: #374151; font-weight: 500;
      transition: background 0.12s;
      &:hover { background: #f3f4f6; }
      &.danger { color: #dc2626; &:hover { background: #fef2f2; } }
      &.primary { color: var(--oosriPrimary); &:hover { background: #fef2f2; } }
    }
  }

  .pagination__row {
    display: flex; justify-content: flex-end;
    padding: 16px 20px; border-top: 1px solid #f3f4f6;
  }

  /* AntD overrides */
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
  .ant-table-tbody > tr:hover > td { background: #fafbfc !important; cursor: pointer; }
`;

export const SettingsPanelWrapper = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;

  .settings__title {
    font-size: 1rem; font-weight: 700; color: #111827;
    margin: 0 0 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid #f3f4f6;
    display: flex; align-items: center; justify-content: space-between;
  }

  .settings__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
  }

  .setting__item {
    display: flex; flex-direction: column; gap: 6px;
    label {
      font-size: 0.78rem; font-weight: 600; color: #374151;
      text-transform: uppercase; letter-spacing: .04em;
    }
    select, input[type="number"] {
      height: 36px; border: 1px solid #e5e7eb; border-radius: 8px;
      padding: 0 10px; font-size: 0.84rem; font-family: inherit; color: #111827;
      background: #fff; outline: none; width: 100%;
      &:focus { border-color: var(--oosriPrimary); }
    }
    .setting__desc { font-size: 0.74rem; color: #9ca3af; }
  }

  .toggle__row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 0; border-bottom: 1px solid #f3f4f6;
    &:last-child { border-bottom: none; }
    .toggle__label {
      .toggle__name { font-size: 0.88rem; font-weight: 600; color: #111827; }
      .toggle__desc { font-size: 0.76rem; color: #9ca3af; }
    }
  }

  .save__btn {
    margin-top: 20px;
    height: 38px; padding: 0 24px;
    background: var(--oosriPrimary); color: #fff;
    border: none; border-radius: 8px;
    font-size: 0.84rem; font-weight: 600;
    cursor: pointer; font-family: inherit;
    transition: opacity .15s;
    &:hover { opacity: 0.88; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }
`;
