import { FlexibleDiv } from "@/components/lib/Box/styles";
import styled from "styled-components";

export const DashboardWrapper = styled(FlexibleDiv)`
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  flex-wrap: nowrap;
  margin-bottom: 20px;

  .summary__wrapper {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: flex-start;
    align-content:flex-start;

    .single__summary__box {
      flex: 0 0 calc(25% - 12px);
      display: flex;
      border-radius: 12px;
      border-right: 1px solid #fee5ec;
      background: linear-gradient(
        180deg,
        #ffeef3 0%,
        rgba(255, 238, 243, 0) 105.26%
      );
      padding: 22px;
      gap: 25px;
      justify-content: flex-start;
      align-items: left; 

      .icon__wrapper {
        background-color: #fee5ec;
        height: 35px;
        width: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
      }

      .summary__text {
        display: flex;
        flex-direction: column;
        gap: 10px;

        h1 {
          font-size: 2.6rem;
        }

        .label__text {
          color: #999;
        }
      }
    }
  }

  .graph__section {
    margin-top: 80px;

    .graph__info {
      gap: 5px;
      h4 {
        font-size: 1.2rem;
      }

      p {
        color: #9e9e9e;
      }
    }

    .chart__box {
      .chart-box-cell {
        width: 600px;
      }
    }
  }

  .table__section {
    margin-top: 80px;
    border: 1px solid rgba(224, 224, 224, 0.6);
    border-radius: 8px;
    gap: 30px;
    padding-top: 30px;

    .recent__text {
      font-size: 1.2rem;
      color: #555555;
      font-weight: 400;
    }

    .see__all__text {
      font-size: 1.1rem;
      color: var(--oosriPrimary);
    }

    .table__class {
      width: 100%;

      .item__number {
        font-size: 0.9rem;
        color: #9e9e9e;
      }
      .sent__pickup {
        border: 1.5px solid #caa216;
        background: #fffae8;
        padding: 5px 10px;
        border-radius: 35px;
        color: #e3b718;
      }

      .delivered__pickup {
        border: 1.5px solid #80a966;
        background: #f2fbed;
        padding: 5px 10px;
        border-radius: 35px;
        color: #80a966;
      }
    }
  }

  @media (max-width: 550px) {
    .summary__wrapper {
      flex-direction: column;
      gap: 15px;
      margin-top: 10px;

      .single__summary__box {
        padding: 12px;

        .icon__wrapper {
          width: 25px;
          height: 25px;

          svg {
            width: 18px !important;
          }
        }

        .summary__text {
          gap: 2px;

          h1 {
            font-size: 1.8rem;
          }

          p {
            font-size: 1rem;
          }
        }
      }
    }

    .graph__section {
      .graph__info__wrapper {
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 10px;
      }

      .graph__box {
        max-height: 220px;

        > div {
          height: 100% !important;
        }
      }
    }

    .table__section {
      margin-top: 60px;

      .recent__sale__wrapper {
        width: 100%;
        overflow-x: auto;
      }
    }
  }
`;