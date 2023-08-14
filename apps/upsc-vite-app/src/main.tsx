import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TopBarLayout from "./topbar-layout/layout.tsx";
import SearchPage from "./topbar-layout/search/page.tsx";
import ViewDocument from "./topbar-layout/view-document/page.tsx";
import "./globals.css";
import "semantic-ui-css/semantic.min.css";

import SearchParamsContextProvider from "./contexts/SearchParamsContextProvider.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SearchPage />,
  },
  {
    path: "/view-document",
    element: <ViewDocument />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <SearchParamsContextProvider>
    <TopBarLayout>
      <RouterProvider router={router} />
    </TopBarLayout>
  </SearchParamsContextProvider>
);
