import styled from "styled-components";

export const PayoutsWrapper = styled.div`
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
    gap: 8px;
    flex-wrap: wrap;

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

  .amount__cell {
    .usd { font-size: 0.88rem; font-weight: 700; color: #111827; }
    .ngn { font-size: 0.72rem; color: #9ca3af; }
  }

  .status__pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;

    .pill__dot { width: 6px; height: 6px; border-radius: 50%; }

    &.pending  { background: #fffbeb; color: #b45309; .pill__dot { background: #d97706; } }
    &.paid     { background: #f0fdf4; color: #15803d; .pill__dot { background: #16a34a; } }
    &.failed   { background: #fef2f2; color: #b91c1c; .pill__dot { background: #dc2626; } }
  }

  .action__btns {
    display: flex;
    gap: 6px;

    button {
      border-radius: 6px;
      padding: 5px 12px;
      font-size: 0.76rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      border: none;
      transition: opacity 0.15s;

      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    .btn__approve { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
    .btn__reject  { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
  }

  .pagination__row {
    display: flex;
    justify-content: flex-end;
    padding: 16px 20px;
    border-top: 1px solid #f3f4f6;
  }
`;
