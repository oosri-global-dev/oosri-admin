import styled from "styled-components";

export const ProfileWrapper=styled.div`
 text-align:start;
 width:100%;
 border:1.5px solid rgba(224, 224, 224, 0.6);
 border-radius:12px;
 padding:24px 40px;

 .business_type_name{
    flex-wrap:nowrap;
    margin-top:30px;
 }

 .total_container{
  max-width:900px;
 }

 @media screen and (max-width:700px){
  padding:10px 20px;

  .business_type_name{
    flex-wrap:wrap;
    margin-top:15px;
 }
    .btn__submit{
      margin-left: auto;
    }
 }
`
