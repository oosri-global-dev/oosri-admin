import styled from "styled-components";

export const CustomUploaderWrapper=styled.div`
.upload__title {
font-weight:600;
margin-bottom: 10px;
}
.upload__container {
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #BBBBBB ;
  background-color: rgba(0, 0, 0, 0.5);
  position: relative;
  padding:12px 0px;
}

.upload__input {
  width: 100%;
  height: 100%;
  opacity: 0; 
  cursor: pointer; 
  position: absolute; 
  top: 0;
  left: 0;
}

.upload__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.placeholder__container{
    display:flex;
    flex-direction:column;
    align-items:center;
    margin:auto;
    text-align:center;
        
    .main__text {
        margin-top: 5px;
        font-size:18px;
        font-weight:400;
        color:white;
      }

      svg{
        width:30px;
        height:30px;
        fill:white;
      }
}
`