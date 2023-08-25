import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopBarLayout from "./pages/topbar-layout/layout.tsx";
import SearchPage from "./pages/topbar-layout/search/page.tsx";
import ViewDocument from "./pages/topbar-layout/view-document/page.tsx";
import "./globals.css";
import "semantic-ui-css/semantic.min.css";

import SearchParamsContextProvider from "./contexts/SearchParamsContextProvider.tsx";
import NoMobileView from "./components/NoMobileView/NoMobileView.tsx";
import { StytchProvider } from "@stytch/react";
import { StytchUIClient } from "@stytch/vanilla-js";
import { Login } from "./pages/login/Login.tsx";
import { AuthContext } from "./contexts/AuthContextProvider.tsx";

const stytch = new StytchUIClient(
  "public-token-live-a3d62995-b815-4c9f-a173-37b55b05b087"
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  window.innerWidth < 300 ? (
    <NoMobileView />
  ) : (
    <StytchProvider stytch={stytch}>
      <BrowserRouter>
        <SearchParamsContextProvider>
          <TopBarLayout>
            <Routes>
              <Route
                path="/search"
                element={
                  <AuthContext>
                    <SearchPage />
                  </AuthContext>
                }
              />
              <Route path="/" element={<Login />} />
              <Route
                path="/view-document"
                element={
                  <AuthContext>
                    <ViewDocument />
                  </AuthContext>
                }
              />
            </Routes>
          </TopBarLayout>
        </SearchParamsContextProvider>
      </BrowserRouter>
    </StytchProvider>
  )
);
