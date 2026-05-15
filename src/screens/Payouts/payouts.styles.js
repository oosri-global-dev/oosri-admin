import styled from "styled-components";

export const PayoutsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  /* ── page intro ───────────────────── */
  .page__header {
    .page__title { font-size: 1.15rem; font-weight: 700; color: #111827; margin: 0 0 4px; }
    .page__sub   { font-size: 0.82rem; color: #6b7280; margin: 0; }
  }

  /* ── main card ────────────────────── */
  .table__card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
  }

  /* ── toolbar ─────────────────────── */
  .toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    padding: 16px 20px;
    border-bottom: 1px solid #f1f5f9;
  }

  .filter__tabs {
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
      &.active { background: var(--oosriPrimary); border-color: var(--oosriPrimary); color: #fff; }
    }
  }

  /* ── amount cell ─────────────────── */
  .amount__cell {
    .usd { font-size: 0.88rem; font-weight: 700; color: #111827; margin: 0; }
    .ngn { font-size: 0.72rem; color: #9ca3af; margin: 0; }
  }

  /* ── status pill ─────────────────── */
  .status__pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;

    .pill__dot { width: 6px; height: 6px; border-radius: 50%; }

    &.pending { background: #fffbeb; color: #b45309; .pill__dot { background: #d97706; } }
    &.paid    { background: #f0fdf4; color: #15803d; .pill__dot { background: #16a34a; } }
    &.failed  { background: #fef2f2; color: #b91c1c; .pill__dot { background: #dc2626; } }
  }

  /* ── action buttons ──────────────── */
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

  /* ── AntD table overrides ────────── */
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
  .ant-pagination { padding: 12px 20px; display: flex; justify-content: flex-end; }
`;
