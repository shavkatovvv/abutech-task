import { createRoot } from "react-dom/client";
import { qClient } from "./config/client/client.ts";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={qClient}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </QueryClientProvider>
);
