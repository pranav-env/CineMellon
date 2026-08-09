import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";

// The browser's native scroll restoration only fires on a hard refresh, not
// on client-side navigation, and fights with ScrollToTop.tsx (which resets
// to the top on every route) when it does. Disabling it makes ScrollToTop
// the single source of truth for scroll position.
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
