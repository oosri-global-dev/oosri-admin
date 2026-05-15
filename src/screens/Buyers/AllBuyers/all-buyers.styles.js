import styled from "styled-components";

export const AllBuyersWrapper = styled.div`
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
