import styled from "styled-components";

export const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;

  /* ── KPI grid ── */
  .kpi__grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
  }

  .kpi__card {
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    transition: box-shadow 0.15s;

    &:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.07); }

    .kpi__icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .kpi__body {
      min-width: 0;

      .kpi__label {
        font-size: 0.75rem;
        color: #9ca3af;
        margin: 0 0 4px;
        white-space: nowrap;
      }

      .kpi__value {
        font-size: 1.5rem;
        font-weight: 700;
        color: #111827;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .kpi__skeleton {
        display: inline-block;
        width: 80px;
        height: 1.5rem;
        border-radius: 6px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.4s infinite;
      }
    }
  }

  /* ── Chart card ── */
  .chart__card {
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 12px;
    padding: 24px;
  }

  .chart__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 20px;

    .chart__title {
      font-size: 1rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }

    .chart__range {
      font-size: 0.76rem;
      color: #9ca3af;
      margin: 3px 0 0;
    }
  }

  .period__tabs {
    display: flex;
    gap: 6px;

    .period__btn {
      background: #f5f5f5;
      border: none;
      border-radius: 20px;
      padding: 5px 14px;
      font-size: 0.78rem;
      color: #6b7280;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
      font-family: inherit;

      &:hover { background: #ffe4e4; color: var(--oosriPrimary); }
      &.active { background: var(--oosriPrimary); color: #fff; }
    }
  }

  .chart__body {
    height: 260px;
    > div { height: 100% !important; }
  }

  /* ── Orders table card ── */
  .table__card {
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 12px;
    padding: 24px;
  }

  .table__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .table__title {
      font-size: 1rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }

    .see__all {
      font-size: 0.82rem;
      color: var(--oosriPrimary);
      text-decoration: none;
      font-weight: 500;
      &:hover { text-decoration: underline; }
    }
  }

  .table__body { overflow-x: auto; }

  /* ── Shimmer animation ── */
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }

  /* ── Responsive ── */
  @media (max-width: 1200px) {
    .kpi__grid { grid-template-columns: repeat(3, 1fr); }
  }

  @media (max-width: 768px) {
    .kpi__grid { grid-template-columns: repeat(2, 1fr); }

    .chart__header { flex-direction: column; align-items: flex-start; }

    .period__tabs { flex-wrap: wrap; }
  }

  @media (max-width: 480px) {
    .kpi__grid { grid-template-columns: 1fr; }
  }

  .clickable__row { cursor: pointer; }
  .ant-table-tbody > tr.clickable__row:hover > td { background: #fafbfc !important; }
`;
