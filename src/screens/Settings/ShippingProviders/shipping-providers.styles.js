import styled from "styled-components";

export const ShippingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;

  .page__intro {
    .section__title { font-size: 1.1rem; font-weight: 700; color: #111827; margin: 0 0 4px; }
    .section__sub   { font-size: 0.82rem; color: #6b7280; margin: 0; }
  }

  .providers__list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .provider__card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
  }

  .provider__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 24px;
    border-bottom: 1px solid #f3f4f6;

    .provider__brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .provider__dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }
  }

  .provider__body {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .fields__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .field__row {
    display: flex;
    flex-direction: column;
    gap: 6px;

    label {
      font-size: 0.78rem;
      font-weight: 600;
      color: #374151;
    }

    .ant-input, .ant-select-selector { border-radius: 8px !important; }
  }

  .test__btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    width: fit-content;
    font-family: inherit;
    transition: background 0.15s;

    &:hover:not(:disabled) { background: #f3f4f6; }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
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

  @media (max-width: 600px) {
    .fields__grid { grid-template-columns: 1fr; }
  }
`;
