import styled from "styled-components";

export const OrderWrapper=styled.div`
    margin:24px;
    border-radius:12px;
    border:1px solid rgba(224, 224, 224, 0.6);

    th{
     background-color:rgba(245, 245, 245, 1) !important;
    }

    .top__section{
        padding:12px;

        .ant-input,.ant-input-group-addon{
            border:none;
        }
    }

    .sort__icons{
      color:rgba(119, 119, 119, 1);
      font-weight:500;

      svg{
        min-height:16px;
        min-width:16px;
      }
    }

    .sent__pickup {
        border: 1.5px solid #caa216;
        background: #fffae8;
        padding: 5px 10px;
        border-radius: 35px;
        color: #e3b718;
        text-transform:capitalize;
    }

    .delivered__pickup {
        border: 1.5px solid #80a966;
        background: #f2fbed;
        padding: 5px 10px;
        border-radius: 35px;
        color: #80a966;
        text-transform:capitalize;
    }
    .processing {
        border: 1.5px solid #ff9800;
        background: #fff3e0;
        padding: 5px 10px;
        border-radius: 35px;
        color: #ff9800;
        text-transform:capitalize;
    }

    .item__number {
        font-size: 0.9rem;
        color: #9e9e9e;
    }

    .paid{
        font-size: 16px;
        color: rgba(85, 211, 82, 0.9);
        text-transform:capitalize;
    }

    .delivery_pay{
        color:rgba(153, 153, 153, 1);
    }

    .details__container{
     position:relative;
     svg{
        cursor:pointer;
        width:20px;
        height:20px;
        path{
            fill:rgba(158, 158, 158, 1);
        }
       }
        .invinsible{
         visibility:hidden;
        }
    
     .details__popup{
        background-color:rgba(255, 255, 255, 1);
        border-radius:12px;
        border:1.5px solid  rgba(189, 189, 189, 0.46);
        position:absolute;
        padding:6px;
        right:0px;
        bottom:-40px;
        cursor:pointer;

        div{
            width:180px;
            padding:8px;
            background-color:rgba(245, 245, 245, 1);
            border-radius:9px;
        }
     }

     .table__class{
      width:100%;
     }

    }
`