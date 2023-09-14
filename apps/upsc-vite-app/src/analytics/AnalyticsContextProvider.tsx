import { FC, ReactNode, useEffect } from "react";
import { AnalyticsClassContext, analyticsClass } from "./AnalyticsClass";
import mixpanel from "mixpanel-browser";

type Props = {
  children: ReactNode;
};

const AnalyticsContextProvider: FC<Props> = ({ children }) => {
  useEffect(() => {
    mixpanel.init("d55e0363a01ca94640164c3326c2466e", {
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
