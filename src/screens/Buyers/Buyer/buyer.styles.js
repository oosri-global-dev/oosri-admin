import styled from "styled-components";

export const BuyerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 900px;

  .profile__card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    align-items: flex-start;
    gap: 20px;
    flex-wrap: wrap;
  }

  .profile__avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #111827;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .profile__main {
    flex: 1;

    .profile__name  { font-size: 1.1rem; font-weight: 700; color: #111827; margin: 0 0 4px; }
    .profile__email { font-size: 0.84rem; color: #6b7280; margin: 0 0 12px; }
    .profile__badges { display: flex; gap: 8px; flex-wrap: wrap; }
  }

  .profile__actions {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    flex-shrink: 0;

    button {
      border-radius: 8px;
      padding: 8px 18px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      border: none;
      transition: opacity 0.15s;

      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    .btn__suspend   { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
    .btn__unsuspend { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
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

    &.active     { background: #f0fdf4; color: #15803d; .pill__dot { background: #16a34a; } }
    &.suspended  { background: #fef2f2; color: #b91c1c; .pill__dot { background: #dc2626; } }
    &.unverified { background: #f9fafb; color: #6b7280; .pill__dot { background: #9ca3af; } }
  }

  .details__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;

    @media (max-width: 640px) { grid-template-columns: 1fr; }
  }

  .info__card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px 24px;

    .card__title { font-size: 0.88rem; font-weight: 700; color: #111827; margin: 0 0 16px; padding-bottom: 10px; border-bottom: 1px solid #f3f4f6; }

    .info__row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 8px 0;
      border-bottom: 1px solid #f9fafb;
      gap: 16px;

      &:last-child { border-bottom: none; }

      .info__label { font-size: 0.78rem; color: #9ca3af; font-weight: 500; }
      .info__value { font-size: 0.84rem; color: #111827; font-weight: 600; text-align: right; }
    }
  }

  .addresses__card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px 24px;

    .card__title { font-size: 0.88rem; font-weight: 700; color: #111827; margin: 0 0 16px; padding-bottom: 10px; border-bottom: 1px solid #f3f4f6; }

    .address__item {
      padding: 12px 0;
      border-bottom: 1px solid #f9fafb;
      &:last-child { border-bottom: none; }

      .address__line { font-size: 0.84rem; color: #111827; margin: 0 0 2px; }
      .address__meta { font-size: 0.74rem; color: #9ca3af; margin: 0; }

      .default__badge {
        display: inline-block;
        font-size: 0.68rem;
        font-weight: 700;
        background: #f0fdf4;
        color: #15803d;
        padding: 2px 8px;
        border-radius: 10px;
        margin-top: 4px;
      }
    }

    .empty__text { font-size: 0.82rem; color: #9ca3af; margin: 0; }
  }
`;
