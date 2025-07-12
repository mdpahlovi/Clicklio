import "@/styles/index.css";
import "@fontsource/poppins/400.css";

import App from "@/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { createRoot } from "react-dom/client";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <App />
        <Analytics />
    </QueryClientProvider>,
);
