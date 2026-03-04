import { FlexibleDiv } from '@/components/lib/Box/styles';
import styled from 'styled-components';

export const FxRateWrapper = styled(FlexibleDiv)`
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 32px;
  max-width: 680px;

  /* Page heading */
  .page__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;

    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
    }

    p {
      font-size: 0.95rem;
      color: #9e9e9e;
      margin: 0;
    }
  }

  /* Current rate banner */
  .current__rate__card {
    width: 100%;
    background: linear-gradient(135deg, #fff0f4 0%, #fff 100%);
    border: 1px solid #fee5ec;
    border-radius: 16px;
    padding: 28px 32px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;

    .rate__label {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
      width: fit-content;

      p {
        font-size: 0.85rem;
        color: #9e9e9e;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin: 0;
      }

      .rate__display {
        font-size: 2.2rem;
        font-weight: 700;
        color: #1a1a1a;
        line-height: 1;
      }

      .rate__sub {
        font-size: 0.85rem;
        color: #9e9e9e;
        margin-top: 2px;
      }
    }

    .rate__meta {
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
      width: fit-content;

      .meta__item {
        font-size: 0.8rem;
        color: #9e9e9e;
        text-align: right;
      }

      .meta__note {
        font-size: 0.85rem;
        color: #555;
        font-style: italic;
        text-align: right;
        max-width: 220px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  /* No rate set state */
  .no__rate__card {
    width: 100%;
    background: #fff8dc;
    border: 1px solid #f0d060;
    border-radius: 16px;
    padding: 20px 28px;
    flex-direction: row;
    align-items: center;
    gap: 12px;

    .warning__icon {
      font-size: 1.4rem;
    }

    p {
      font-size: 0.9rem;
      color: #6b5800;
      margin: 0;
    }
  }

  /* Update form card */
  .update__card {
    width: 100%;
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 16px;
    padding: 28px 32px;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;

    h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
    }

    .input__group {
      width: 100%;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;

      label {
        font-size: 0.88rem;
        font-weight: 500;
        color: #555;
      }

      .input__prefix__wrapper {
        width: 100%;
        position: relative;

        .prefix {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1rem;
          color: #9e9e9e;
          font-weight: 600;
          pointer-events: none;
        }

        input {
          width: 100%;
          height: 48px;
          border: 1.5px solid #e0e0e0;
          border-radius: 10px;
          font-size: 1.05rem;
          padding: 0 16px 0 48px;
          outline: none;
          transition: border-color 0.2s;
          color: #1a1a1a;
          background: #fafafa;
          box-sizing: border-box;

          &:focus {
            border-color: var(--oosriPrimary);
            background: #fff;
          }

          &::placeholder {
            color: #bdbdbd;
          }
        }
      }

      textarea {
        width: 100%;
        border: 1.5px solid #e0e0e0;
        border-radius: 10px;
        font-size: 0.9rem;
        padding: 12px 16px;
        outline: none;
        resize: vertical;
        min-height: 80px;
        transition: border-color 0.2s;
        color: #1a1a1a;
        background: #fafafa;
        font-family: inherit;
        box-sizing: border-box;

        &:focus {
          border-color: var(--oosriPrimary);
          background: #fff;
        }

        &::placeholder {
          color: #bdbdbd;
        }
      }

      .helper__text {
        font-size: 0.78rem;
        color: #9e9e9e;
        margin: 0;
      }

      .preview__text {
        font-size: 0.85rem;
        color: var(--oosriPrimary);
        font-weight: 500;
        margin: 0;
      }

      .error__text {
        font-size: 0.82rem;
        color: #e53935;
        margin: 0;
      }
    }

    .submit__btn {
      margin-top: 4px;
      align-self: flex-end;
    }
  }

  /* Success/error toast-like feedback */
  .feedback__banner {
    width: 100%;
    padding: 14px 20px;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 500;

    &.success {
      background: #f0faf4;
      border: 1px solid #81c784;
      color: #2e7d32;
    }

    &.error {
      background: #fff1f0;
      border: 1px solid #ef9a9a;
      color: #c62828;
    }
  }
`;
