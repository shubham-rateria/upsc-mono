import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopBarLayout from "./pages/topbar-layout/layout.tsx";
import SearchPage from "./pages/topbar-layout/search/page.tsx";
import ViewDocument from "./pages/topbar-layout/view-document/page.tsx";
import "./globals.css";
import "semantic-ui-css/semantic.min.css";

import SearchParamsContextProvider from "./contexts/SearchParamsContextProvider.tsx";
import { StytchProvider } from "@stytch/react";
import { StytchUIClient } from "@stytch/vanilla-js";
import { Login } from "./pages/login/Login.tsx";
import { Login as MLogin } from "./mobile/pages/Login/Login.tsx";
import { AuthContext } from "./contexts/AuthContextProvider.tsx";
import TourContext from "./contexts/TourContext.tsx";
import MSearch from "./mobile/pages/Search/Search.tsx";
import DocumentViewerPage from "./mobile/pages/DocumentViewer/DocumentViewer.tsx";
import AnalyticsContextProvider from "./analytics/AnalyticsContextProvider.tsx";
import UserContextProvider from "./contexts/UserContextProvider.tsx";

const stytch = new StytchUIClient(
  "public-token-live-a3d62995-b815-4c9f-a173-37b55b05b087"
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  window.innerWidth < 600 ? (
    <StytchProvider stytch={stytch}>
      <BrowserRouter>
        <SearchParamsContextProvider>
          <Routes>
            <Route path="/" index element={<MLogin />} />
            <Route
              path="/search"
              element={
                <AuthContext>
                  <MSearch />
                </AuthContext>
              }
            />
            <Route
              path="/view-document"
              element={
                <AuthContext>
                  <DocumentViewerPage />
                </AuthContext>
              }
            />
          </Routes>
        </SearchParamsContextProvider>
      </BrowserRouter>
    </StytchProvider>
  ) : (
    <StytchProvider stytch={stytch}>
      <BrowserRouter>
        <UserContextProvider>
          <SearchParamsContextProvider>
            <AnalyticsContextProvider>
              <Routes>
                <Route
                  path="/search"
                  element={
                    <AuthContext>
                      <TourContext>
                        <TopBarLayout>
                          <SearchPage />
                        </TopBarLayout>
                      </TourContext>
                    </AuthContext>
                  }
                />
                <Route path="/" element={<Login />} />
                <Route
                  path="/view-document"
                  element={
                    <AuthContext>
                      <TourContext>
                        <TopBarLayout>
                          <ViewDocument />
                        </TopBarLayout>
                      </TourContext>
                    </AuthContext>
                  }
                />
              </Routes>
            </AnalyticsContextProvider>
          </SearchParamsContextProvider>
        </UserContextProvider>
      </BrowserRouter>
    </StytchProvider>
  )
);
