import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TopBarLayout from "./topbar-layout/layout.tsx";
import SearchPage from "./topbar-layout/search/page.tsx";
import "./globals.css";
import "semantic-ui-css/semantic.min.css";

import SearchParamsContextProvider from "./contexts/SearchParamsContextProvider.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SearchPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SearchParamsContextProvider>
      <TopBarLayout>
        <RouterProvider router={router} />
      </TopBarLayout>
    </SearchParamsContextProvider>
  </React.StrictMode>
);
