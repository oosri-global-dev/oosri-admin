import styled from "styled-components";

export const SaleAnalyticsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  /* ── KPI row ─────────────────────── */
  .kpi__row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    @media (max-width: 640px) { grid-template-columns: 1fr; }
  }

  .kpi__card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    gap: 16px;

    .kpi__icon {
      width: 48px; height: 48px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }

    .kpi__label { font-size: .8rem; color: #6b7280; font-weight: 500; margin: 0 0 4px; }
    .kpi__value { font-size: 1.5rem; font-weight: 700; color: #111827; margin: 0; }
  }

  /* ── chart card ──────────────────── */
  .chart__card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;

    .chart__header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 24px 0; flex-wrap: wrap; gap: 12px;
    }

    .chart__title { font-size: 1rem; font-weight: 700; color: #111827; margin: 0; }
    .chart__body  { padding: 12px 24px 24px; height: 280px; position: relative; }
  }

  /* ── generic section card ────────── */
  .section__card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;

    .section__header {
      padding: 20px 24px;
      border-bottom: 1px solid #f1f5f9;
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 12px; flex-wrap: wrap;
    }

    .section__title { font-size: 1rem; font-weight: 700; color: #111827; margin: 0 0 2px; }
    .section__sub   { font-size: .8rem; color: #6b7280; margin: 0; }
    .section__body  { padding: 24px; }
  }

  /* ── product highlight grid ──────── */
  .highlight__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    @media (max-width: 860px) { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: 560px) { grid-template-columns: 1fr; }
  }

  .highlight__item {
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 16px;
    display: flex; flex-direction: column; gap: 10px;

    .hi__label {
      font-size: .7rem; font-weight: 700; color: #9ca3af;
      text-transform: uppercase; letter-spacing: .06em;
    }

    .hi__body { display: flex; align-items: center; gap: 12px; }

    .hi__img {
      width: 48px; height: 48px; border-radius: 8px;
      object-fit: cover; background: #f1f5f9; flex-shrink: 0;
    }

    .hi__placeholder {
      width: 48px; height: 48px; border-radius: 8px;
      background: #f1f5f9; flex-shrink: 0;
    }

    .hi__name  { font-size: .84rem; font-weight: 600; color: #111827; margin: 0 0 3px; }
    .hi__count { font-size: .78rem; color: #16a34a; font-weight: 600; margin: 0; }
  }

  /* ── product report filters ──────── */
  .report__filters {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; flex-wrap: wrap; margin-bottom: 20px;

    .period__tabs {
      display: flex; gap: 4px; flex-wrap: wrap;

      button {
        height: 30px; padding: 0 12px; border-radius: 6px;
        border: 1px solid #e2e8f0; background: #fff;
        font-size: .78rem; font-weight: 500; color: #6b7280;
        cursor: pointer; font-family: inherit; transition: all .15s;
        &:hover  { border-color: var(--oosriPrimary); color: var(--oosriPrimary); }
        &.active { background: var(--oosriPrimary); border-color: var(--oosriPrimary); color: #fff; }
      }
    }
  }
`;
