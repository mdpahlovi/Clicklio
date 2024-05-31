import "@/styles/index.css";
import "@fontsource/poppins";

import App from "@/app";
import { createRoot } from "react-dom/client";

import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>
);
