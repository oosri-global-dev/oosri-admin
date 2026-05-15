import styled from "styled-components";

export const GatewaysWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 960px;

  .page__intro {
    .section__title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 4px;
    }
    .section__sub {
      font-size: 0.82rem;
      color: #6b7280;
      margin: 0;
    }
  }

  .gateways__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .gateway__card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
  }

  .gateway__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid #f3f4f6;

    .gateway__brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1rem;
      font-weight: 700;
    }
  }

  .gateway__body {
    padding: 20px 24px;
  }

  .fields__grid {
    display: flex;
    flex-direction: column;
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

    .ant-input,
    .ant-select-selector {
      border-radius: 8px !important;
      font-size: 0.84rem !important;
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

  @media (max-width: 768px) {
    .gateways__grid { grid-template-columns: 1fr; }
  }
`;
