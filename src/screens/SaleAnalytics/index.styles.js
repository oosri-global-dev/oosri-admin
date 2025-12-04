import styled from "styled-components";

export const SaleAnalyticsWrapper= styled.div`
 .summary__wrapper {
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 15px;
    
    .single__summary__box {
      max-width:450px;
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
    .graph__box{
        height:100px;
    }

    .table__section {
    border: 1px solid rgba(224, 224, 224, 0.6);
    border-radius: 8px;
    gap: 30px;
    padding-top: 30px;
    margin:80px 0px 0px 0px;

    .recent__text {
      font-size: 1.2rem;
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
    }
  }
    .top__recent__box{
        border-bottom: 1px solid rgba(224, 224, 224, 0.6);
        padding-bottom:30px;

        h1{
            color:#333333;
            font-weight:400;
        }

        p{
            color:#999999;
            margin-top:5px;
        }
    }

    .product__report{
        padding:32px 0px;

        h1{
         font-size:28px;
         font-weight:400;
        }
        p{
        margin-top:3px;
         color:#9E9E9E;
         font-size:14px;
         font-weight:400;
        }
    }

    .recent__sale__wrapper{
        .search__text{
            margin-bottom:20px;
        }
        h2{
            color:#BBBBBB;
            font-weight:400;
            font-size:18px;
        }

        h5{
            font-size:16px;
            color:#333333;
            font-weight:500;
        }
        img{
            border-radius:100%;
            object-fit:cover;
            width:70px;
            height:70px;
        }

        .report__table{
            border-right:2px solid #EEEEEEB2;
        }

        .total__earnings{
            p{
                color:#9E9E9E;
                font-weight:500;
                font-size:18px;            
            }
            h3{
                color:#333333;
                font-weight:500;
                font-size:24px;
            }
        }
    }

    .empty__search{
     div{
        padding:24px;
        border-radius:100%;
        background-color:#F5F5F5;
        color:#BDBDBD;
     }

     svg{
        width:24px;
        height:24px;
     }

     p{
        color:#BBBBBB;
        font-size:18px;
        font-weight:400;
     }
    }
    .item__box{
        img{
            border-radius:12px;
        }

        .image__text{
            display:flex;
            align-items:center;
            gap:12px;
            h5{
             white-space:nowrap;
            }
        }

        
        .percent__decrease{
          color:#F76241;
          font-weight:500;
          white-space:nowrap;

          svg{
            fill:#F76241;
            margin:3px 5px 0px 0px;
          }
        }

        .percent__increase{
          color:#89B46D;
          font-weight:500;
          white-space:nowrap;

          svg{
            fill:#89B46D;
            margin:2px 5px 0px 0px;
          }
        }

        .neutral{
          color:#999999;
          white-space:nowrap;
        }
    }
    .item__box1{
        border-right:1px solid rgba(224, 224, 224, 0.6);
    }

    .item__box2{
       margin-left:20px;
    }

    @media (max-width: 660px) {
    .summary__wrapper {
      flex-direction: column;
      gap: 15px;
      margin-top: 10px;
      align-items:start;

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

    .table__section {
      margin:40px 0px 0px 0px;
    }

    .top__recent__box{
      padding:0px 20px 20px 20px;
    }

    .item__box{
      width:100%;
    }
    .item__box2{
       margin-left:0px;
    }

    .recent__sale__wrapper{
      padding:0px 20px;
    }

    .recent__sale__wrapper{
      img{
        width:50px;
        height:50px;
      }

      h5{
        font-size:12px;
      }
    }

    .chart__box{
      padding:30px 0px 50px 0px;
    }

    .btn__group{
      gap:5px;
      width:100%;
      justify-content:start;
      margin-top:9px;
    }
    .product__report{
      padding-bottom:0px;
    }

     .multi__select__box{
       padding: 0px 5px 20px 5px;
     }

     .multi__select{
      width:100%;
     }
}
`