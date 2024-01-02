import { gql } from "@apollo/client";

export const CREATE_CANVAS = gql`
    mutation Create_Canvas($code: String!, $name: String!) {
        createCanvas(code: $code, name: $name) {
            code
        }
    }
`;

export const UPDATE_CANVAS = gql`
    mutation UpdateCanvas($code: String!, $data: CanvasInput!) {
        updateCanvas(code: $code, data: $data) {
            code
        }
    }
`;

export const DELETE_CANVAS = gql`
    mutation Delete_Canvas($code: String!) {
        deleteCanvas(code: $code) {
            code
        }
    }
`;
