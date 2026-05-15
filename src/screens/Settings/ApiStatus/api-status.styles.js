import styled from "styled-components";

export const ApiStatusWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  .status__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;

    .section__title { font-size: 1.1rem; font-weight: 700; color: #111827; margin: 0 0 4px; }
    .section__sub   { font-size: 0.82rem; color: #6b7280; margin: 0; }
  }

  .header__right {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .overall__badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.82rem;
    font-weight: 600;

    .overall__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    &.up       { background: #f0fdf4; color: #15803d; .overall__dot { background: #16a34a; } }
    &.down     { background: #fef2f2; color: #b91c1c; .overall__dot { background: #dc2626; } }
    &.degraded { background: #fffbeb; color: #b45309; .overall__dot { background: #d97706; } }
    &.unknown  { background: #f9fafb; color: #6b7280; .overall__dot { background: #9ca3af; } }
  }

  .refresh__btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 0.82rem;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s;

    &:hover:not(:disabled) { background: #f9fafb; }
    &:disabled { opacity: 0.6; cursor: not-allowed; }

    .spinning { animation: spin 1s linear infinite; }
  }

  /* Services grid */
  .services__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .service__card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: box-shadow 0.15s;

    &:hover { box-shadow: 0 2px 10px rgba(0,0,0,0.06); }

    &.up       { border-left: 3px solid #16a34a; }
    &.down     { border-left: 3px solid #dc2626; }
    &.degraded { border-left: 3px solid #d97706; }
    &.unknown  { border-left: 3px solid #9ca3af; }

    &.skeleton {
      border-left: 3px solid #f0f0f0;
      gap: 8px;
      animation: pulse 1.5s infinite;
    }
  }

  .service__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .service__brand {
    display: flex;
    align-items: center;
    gap: 8px;

    .service__name {
      font-size: 0.9rem;
      font-weight: 600;
      color: #111827;
    }
  }

  .status__badge {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;
    white-space: nowrap;

    &.up       { background: #f0fdf4; color: #15803d; }
    &.down     { background: #fef2f2; color: #b91c1c; }
    &.degraded { background: #fffbeb; color: #b45309; }
    &.unknown  { background: #f9fafb; color: #6b7280; }
  }

  .service__meta {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;

    .meta__chip {
      font-size: 0.72rem;
      padding: 3px 10px;
      border-radius: 6px;
      cursor: default;

      &.latency { background: #f3f4f6; color: #374151; font-weight: 600; }
      &.time    { background: #f3f4f6; color: #9ca3af; }
    }
  }

  .service__error {
    font-size: 0.74rem;
    color: #dc2626;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Skeleton */
  .skel__line {
    height: 14px;
    border-radius: 6px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;

    &.wide  { width: 70%; }
    &.short { width: 40%; }
  }

  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }

  @media (max-width: 900px)  { .services__grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px)  { .services__grid { grid-template-columns: 1fr; } }
`;
