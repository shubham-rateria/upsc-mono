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
import TourContext from "./contexts/TourContext.tsx";

const stytch = new StytchUIClient(
  "public-token-live-a3d62995-b815-4c9f-a173-37b55b05b087"
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  window.innerWidth < 600 ? (
    <NoMobileView />
  ) : (
    <StytchProvider stytch={stytch}>
      <BrowserRouter>
        <SearchParamsContextProvider>
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
        </SearchParamsContextProvider>
      </BrowserRouter>
    </StytchProvider>
  )
);
