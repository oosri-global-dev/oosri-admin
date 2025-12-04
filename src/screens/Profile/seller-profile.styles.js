import { FlexibleDiv } from "@/components/lib/Box/styles";
import styled from "styled-components";

export const SellersProfileWrapper = styled(FlexibleDiv)`
  .tabs__custom {
    width: 100%;
    margin-bottom: 15px;

    .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
      color: var(--oosriPrimary) !important;
    }

    .ant-tabs-ink-bar {
      background: var(--oosriPrimary);
    }
  }

  .country__select {
  width: 100%;}

  .products__table__section {
    border: 1px solid rgba(224, 224, 224, 0.6);
    border-radius: 8px;
    box-sizing: border-box;

    .search__body__section {
      box-sizing: border-box;
      padding: 25px 20px;

      .search__section {
        width: fit-content;

        .text__field__custom {
          border: 1px solid rgba(224, 224, 224, 0.6);
          width: 300px;
          margin-left: 8px;
        }
      }

      .filter__btn__custom {
        display: flex;
        gap: 5px;
        align-items: center;
        justify-content: center;
      }
    }

    .table__class {
      width: 100%;

      .verified__text {
        color: #55d352;
        border: 1px solid #55d352;
        border-radius: 15px;
        padding: 5px 10px;
        font-size: 1rem;
      }

       .unverified__text {
        color: #FC5353;
        border: 1px solid #FC5353;
        border-radius: 15px;
        padding: 5px 10px;
        font-size: 1rem;
      }
    }
  }

  .profile__details__section, .business__details__section{
  padding:20px 0;
  border:1px solid red;
  border-radius: 12px;
  border-color:var(--oosriFadedWhite)
  }

  .profile__info__wrapper {
    width:60%;
    h2{
     justify-content:flex-start;
     text-align:left;
     width:100%;
     padding-left:30px;
    }
  }

  .profile__image__wrapper {
  width:40%;
  }

  .info_cont, .business__info__wrapper {
  padding: 20px 30px;

  }

  .info__inner_cont1,.info__inner_cont2, .info__inner_cont3,.info__inner_cont4 {
  padding-bottom:40px;
  display: flex;
  gap:5px;
  justify-content: space-between;

  }
  .info__inner_cont3 {
  align-items:flex-start;
  // padding-top:40px;
  }

  .info1, .info2 {
  width:45%;
  gap:5px;
  flex-direction:column;
  align-items:flex-start;
  justify-content:center;
  }

  .info1 p:nth-child(1), .info2 > p:nth-child(1) {
      font-weight:600;
  }
 .info1 p:nth-child(2), .info2 > p:nth-child(2) {
      color:var(--oosriFadedWhite)
  }


  // Business details styling

  .business__details__section {
  display: flex;
  justify-content: space-around;
  }

  .business__info__wrapper {
  width:50%;
  flex-basis:80%;
}

  .business__details__form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: left;
    gap: 25px;
  }

  .single__row label {
  font-weight: 600
  }

  .single__row p {
  color: #777777;
  font-size: 0.98rem}

  .edit__details__cont {
  width:50%;
  height: 900px;
  display: flex;
  justifyContent: center;
  align-items: flex-start;
  flex-basis:20%;
  }

  // Bank details styling 

  .business__info__wrapper {
  width:50%;
  }

  .edit__bank__details__cont {
  width: 50%;
  height:370px;
  display: flex;
  }


  // ********Media queries********

  @media (max-width: 768px) {

  // Personal details styling

    .info__inner_cont1,.info__inner_cont2, .info__inner_cont3,.info__inner_cont4 {
      flex-direction: column;
      gap: 20px; 
}

    .info1, .info2 {
      width:100%;
      
  }

    .profile__details__section {
      display: flex;
      flex-direction: column;
  }
    .profile__info__wrapper {
      width:100%;
  }

  .profile__image__wrapper {
    width:100%;
  }

  // Business details styling

  .input__container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  }

  .single__row {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 10px;
    }

  .business__details__section {
    flex-direction: column;
  }

  .business__info__wrapper {
        width:100%;
}

.edit__details__cont {
  height: 100%;
  }

  // Bank details styling
  .business__info__wrapper {
  width:100%;
  }

  .edit__bank__details__cont {
  height:100%;
  width: 100%;
  }

}
`;