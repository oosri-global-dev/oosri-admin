import styled from "styled-components";
import { FlexibleDiv } from "../Box/styles";

export const MultiSearchBarWrapper=styled(FlexibleDiv)`
    .ant-input-affix-wrapper{
        padding:7px 15px;
        border-radius:12px;
        border-color:rgba(224, 224, 224, 0.7);
    }

    .ant-input-outlined:focus, .ant-input-outlined:focus-within {
        border-color: rgba(254, 229, 236, 1);
        box-shadow: none;
        outline: 0;
    }
    .ant-input-outlined:hover{
        border-color: rgba(254, 229, 236, 1);
        box-shadow: #ffffff;
        outline: 0;
    }

    // svg{
    //   fill:#9E9E9E;
    // }

    .ant-input {
        border-left: none;
        padding:8px 0px;
        border-radius:12px;
    }

    .ant-input-group-addon{
        padding-top:2px;
        border-radius:12px;

        }
        svg{
            stroke:#9E9E9E;
            min-width:24px;
            min-height:24px;
        }
`

export const SearchItemWrapper=styled(FlexibleDiv)`
    border:1px solid rgba(201, 65, 105, 1);
    background-color:#FFEEF3;
    border-radius:100px;

    img{
        width:20px;
        height:20px;
        border-radius:100%;
    }

    p{
        color:#FB5183 !important;
        margin-top:0px !important; 
        font-weight:500;
    }

    svg{
        margin-top:2px;
       path{
        stroke:rgba(201, 65, 105, 1);
        cursor:pointer;
       }
    }
` 