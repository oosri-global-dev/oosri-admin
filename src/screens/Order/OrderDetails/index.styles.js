import styled from "styled-components";

export const OrderDetailsWrapper= styled.div`
  .profile__section{
    img{
        width:60px;
        height:60px;
        object-fit:cover;
        border-radius:100%;
    }

    h5{
     color:#333333;
     font-size:16px;
    }
     
    p{
     color:#777777;
     font-size:14px;
    }
  }

  .item__info{
    border-top:2px solid #EEEEEE;
    padding:70px 70px 0px 0px;
    margin-top:40px;
    position:relative;

    .absolute__item{
     position:absolute;
     top:0;
     left:0;
     color:#777777;
     display:flex;
     align-items:center;
     gap:6px;
     background-color:#F5F5F5;
     padding:10px 35px 10px 10px;
     border-radius:0px 0px 24px 24px;
     font-weight:500;
     font-size:14px;

     img{
        width:24px;
        height:24px;
        border-radius:100px;
        object-fit:cover;
     }
    }

    img{
        width:200px;
        height:150px;
        border-radius:10px;
        object-fit:cover;
    }

    h5{
     font-size:28px;
    }

    p{
        color:#777777;
        font-size:16px;
    }
  }
  .strike__through{
    text-decoration:line-through;
  }

  .delivery__item{
    background-color:#FFFFFF;
    border:1px solid rgba(224, 224, 224, 0.6);
    border-radius:12px;
    padding:40px 24px;
    margin-top:50px;
    box-shadow:0px 1px 2px 0px #0000000A;

    h4{
     font-weight:500;
    }
    .detail__data{
      color:#333333;
    }

    .detail__info{
      color:#BBBBBB;
    }

    .total__amount{
      margin-top:10px;
    }
  }

  @media screen and (max-width:660px){
    .profile__section{   
     img{
        width:55px;
        height:50px;
     }

      h5{
        font-size:14px;
      }
        
      p{
        color:#777777;
        font-size:12px;
      }
    }

    .item__info{
      margin-top:20px;

      .absolute__item{
       padding:10px 35px 10px 10px;
       p{
        font-size:12px;
       }
      }
       h2{
        font-size:19px;
       }

       h5{
        font-size:24px;
       }
    }
}`