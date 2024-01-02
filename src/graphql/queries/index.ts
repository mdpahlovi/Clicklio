import { gql } from "@apollo/client";

export const GET_CANVASES = gql`
    query GetCanvases {
        canvases {
            code
            name
            image
            createdAt
        }
    }
`;

export const GET_CANVAS = gql`
    query GetCanvas($code: String!) {
        canvas(code: $code) {
            code
            name
            elements {
                offsetX
                offsetY
                path
                width
                height
                stroke
                tool
            }
            createdAt
        }
    }
`;
