import styled from "styled-components";

export const AllBuyersWrapper = styled.div`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;

  /* ── toolbar ─────────────────────── */
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

  .filter__tabs {
    display: flex;
    gap: 4px;
    button {
      height: 32px; padding: 0 14px; border-radius: 6px;
      border: 1px solid #e2e8f0; background: #fff;
      font-size: .8rem; font-weight: 500; color: #6b7280;
      cursor: pointer; font-family: inherit; transition: all .15s;
      &:hover { border-color: var(--oosriPrimary); color: var(--oosriPrimary); }
      &.active { background: var(--oosriPrimary); border-color: var(--oosriPrimary); color: #fff; }
    }
  }

  /* ── name cell ───────────────────── */
  .buyer__name__cell {
    display: flex; align-items: center; gap: 10px;
    .buyer__avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: #f1f5f9; color: #475569;
      font-size: .72rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .buyer__fullname { font-size: .85rem; font-weight: 600; color: #111827; margin: 0; }
    .buyer__email    { font-size: .74rem; color: #9ca3af; margin: 0; }
  }

  /* ── status pill ─────────────────── */
  .status__pill {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: .75rem; font-weight: 600;
    padding: 3px 10px; border-radius: 20px;
    .pill__dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
    &.active     { background: #f0fdf4; color: #16a34a; .pill__dot { background: #16a34a; } }
    &.suspended  { background: #fff1f2; color: #be123c; .pill__dot { background: #fc5353; } }
    &.unverified { background: #fffbeb; color: #b45309; .pill__dot { background: #f59e0b; } }
  }

  /* ── action popover ──────────────── */
  .action__menu {
    display: flex; flex-direction: column; gap: 2px;
    min-width: 160px; padding: 4px;
    .action__item {
      padding: 7px 10px; font-size: .82rem; cursor: pointer;
      border-radius: 6px; color: #374151; font-weight: 500; transition: background .12s;
      &:hover { background: #f1f5f9; }
      &.danger { color: #dc2626; &:hover { background: #fef2f2; } }
    }
  }

  /* ── AntD table overrides ────────── */
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

  /* legacy flex column — keep for fallback */
  display: flex;
  flex-direction: column;
  gap: 24px;

  .page__intro {
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

      input {
        border: none;
        outline: none;
        font-size: 0.84rem;
        color: #111827;
        width: 100%;
        font-family: inherit;
        background: transparent;
        &::placeholder { color: #9ca3af; }
      }
    }

    .filter__tabs {
      display: flex;
      gap: 4px;

      .tab__btn {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 7px 16px;
        font-size: 0.8rem;
        font-weight: 600;
        color: #6b7280;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.15s;

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

  .buyer__name__cell {
    display: flex;
    align-items: center;
    gap: 10px;

    .buyer__avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #111827;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .buyer__info {
      .buyer__fullname { font-size: 0.85rem; font-weight: 600; color: #111827; margin: 0; }
      .buyer__email    { font-size: 0.74rem; color: #9ca3af; margin: 0; }
    }
  }

  .status__pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;

    .pill__dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    &.active     { background: #f0fdf4; color: #15803d; .pill__dot { background: #16a34a; } }
    &.suspended  { background: #fef2f2; color: #b91c1c; .pill__dot { background: #dc2626; } }
    &.unverified { background: #f9fafb; color: #6b7280; .pill__dot { background: #9ca3af; } }
  }

  .action__menu {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 160px;

    .action__item {
      padding: 8px 12px;
      font-size: 0.82rem;
      cursor: pointer;
      border-radius: 6px;
      color: #374151;
      font-weight: 500;
      transition: background 0.12s;

      &:hover { background: #f3f4f6; }
      &.danger { color: #dc2626; &:hover { background: #fef2f2; } }
    }
  }

  .pagination__row {
    display: flex;
    justify-content: flex-end;
    padding: 16px 20px;
    border-top: 1px solid #f3f4f6;
  }
`;
