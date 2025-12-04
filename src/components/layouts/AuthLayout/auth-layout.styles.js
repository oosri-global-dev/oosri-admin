import { FlexibleDiv } from "@/components/lib/Box/styles";
import styled from "styled-components";
import BackgroundImage from "@/assets/images/backgroundImg.jpg";

export const AuthLayoutWrapper = styled(FlexibleDiv)`
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  height: 100dvh;

  .left__section {
    height: 100%;
    width: 35%;
    background-image: url(${BackgroundImage.src});
    background-position: center;
    background-size: cover;
    position: relative;

    .background__opacity {
      z-index: 2;
      background: black;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.5;
    }

    .content__wrapper {
      width: 80%;
      text-align: left;
      z-index: 4;

      h1,
      p {
        text-align: left;
        width: 100%;
        color: var(--oosriWhite);
      }

      .hero__text {
        font-size: 2.5rem;
        font-weight: 700;
      }

      p {
        font-size: 1.3rem;
        font-weight: 500;
      }
    }
  }

  .right__section {
    height: 100%;
    width: 65%;
    overflow-y: scroll;
  }

  //target only 550px
  @media (max-width: 650px) {
    height: 100%;

    .left__section {
      display: none;
    }

    .right__section {
      width: 100%;
      height: fit-content;
      box-sizing: border-box;
      padding: 10px;
      justify-content: flex-start;
      align-items: flex-start;

      .sub__text {
        text-align: center;
      }
    }
  }
`;