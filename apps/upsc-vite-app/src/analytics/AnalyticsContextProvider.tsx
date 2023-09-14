import { FC, ReactNode, useEffect } from "react";
import { AnalyticsClassContext, analyticsClass } from "./AnalyticsClass";
import mixpanel from "mixpanel-browser";

type Props = {
  children: ReactNode;
};

const AnalyticsContextProvider: FC<Props> = ({ children }) => {
  useEffect(() => {
    mixpanel.init("d3bf51a56521ecb79c0e330786004dce", {
      debug: true,
      track_pageview: true,
      persistence: "localStorage",
    });
  }, []);

  return (
    <AnalyticsClassContext.Provider value={analyticsClass}>
      {children}
    </AnalyticsClassContext.Provider>
  );
};

export default AnalyticsContextProvider;
