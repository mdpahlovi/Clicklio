export const typeDefs = `#graphql
    type Element {
        offsetX: Int
        offsetY: Int
        path: [[Int]]
        width: Int
        height: Int
        stroke: String
        tool: String
    }
    
    type Canvas {
        code: String
        name: String
        image: String
        elements: [Element]
        createdAt: String
        updatedAt: String
    }

    type Query {
        canvases: [Canvas]
        canvas(code: String!): Canvas
    }

    type Mutation {
        createCanvas(code: String!, name: String!): Canvas
        updateCanvas(code: String!, data: CanvasInput!): Canvas
        deleteCanvas(code: String!): Canvas
    }

    input ElementInput {
        offsetX: Int
        offsetY: Int
        path: [[Int]]
        width: Int
        height: Int
        stroke: String
        tool: String
    }

    input CanvasInput {
        image: String
        elements: [ElementInput]
    }
`;
