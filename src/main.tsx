import "./index.css";

import App from "./app";
import ReactDOM from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
    uri: "https://clicklio.onrender.com/",
    cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
);
