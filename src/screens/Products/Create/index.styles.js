import styled from "styled-components";

export const CreateProductPageWrapper=styled.div`
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
.tab__item{
  max-width:1000px;
}
.container_wrapper{
 flex-wrap:nowrap;
 gap:24px;

 @media screen and (max-width:950px){
  flex-direction:column;
 }
}

.product__item{
  display:flex;
  align-items:start;
  flex-direction:column;
  width:70%;
  gap:6px;
  flex-basis: fit-content;

  p{
   font-size:12px;
   color:#BBBBBB;
  }
}

button{
    background-color:var(--oosriPrimary);
    color:var(--oosriWhite);
}
    
.img__upload{
  gap:16px;
  .upload__container{
   background-color:transparent !important;
   border-style:dashed !important;
   padding:12px 20px;
   height:150px !important;
   width:150px;
   
   
   .main__text{
    color:#777777 !important;
    font-size:12px !important;
    }
    svg{
      width:12px !important;
      height:12px !important;
      fill:#777777 !important;
      }
    }
}
    .column_item{
       height:100%;
       gap:10px;
      .upload__container{
        height:65px !important;
      }

      .upload__title{
       display:none !important;
      }
    }

    .add_btn{
      position:fixed;
      bottom:5px;
      right:10px;
      z-index:1000;
      width:fit-content;
    }

`