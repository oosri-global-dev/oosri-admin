import styled from "styled-components";

export const PlatformWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 720px;

  .page__intro {
    .section__title { font-size: 1.1rem; font-weight: 700; color: #111827; margin: 0 0 4px; }
    .section__sub   { font-size: 0.82rem; color: #6b7280; margin: 0; }
  }

  .settings__card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 24px;

    .card__title {
      font-size: 0.9rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f3f4f6;
    }
  }

  .toggles__list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .toggle__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1px solid #f9fafb;
    gap: 20px;

    &:last-child { border-bottom: none; }

    .toggle__info {
      flex: 1;
      .toggle__label { font-size: 0.88rem; font-weight: 600; color: #111827; margin: 0 0 2px; }
      .toggle__sub   { font-size: 0.76rem; color: #9ca3af; margin: 0; }
    }
  }

  .maintenance__msg {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;

    label { font-size: 0.78rem; font-weight: 600; color: #374151; }
  }

  .limits__grid {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .limit__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1px solid #f9fafb;
    gap: 20px;

    &:last-child { border-bottom: none; }

    .limit__info {
      flex: 1;
      .limit__label { font-size: 0.88rem; font-weight: 600; color: #111827; margin: 0 0 2px; }
      .limit__sub   { font-size: 0.76rem; color: #9ca3af; margin: 0; }
    }
  }

  .save__row {
    display: flex;
    justify-content: flex-end;

    .save__btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--oosriPrimary);
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 10px 24px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.15s;

      &:hover:not(:disabled) { background: #e04040; }
      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }
  }
`;
