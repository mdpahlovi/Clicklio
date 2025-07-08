import "@/styles/index.css";
import "@fontsource/poppins/400.css";

import App from "@/app";
import { createRoot } from "react-dom/client";

import { Analytics } from "@vercel/analytics/react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <App />
        <Analytics />
    </QueryClientProvider>,
);
