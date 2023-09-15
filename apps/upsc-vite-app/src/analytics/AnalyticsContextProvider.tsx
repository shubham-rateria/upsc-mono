import { FC, ReactNode, useEffect } from "react";
import { AnalyticsClassContext, analyticsClass } from "./AnalyticsClass";
import mixpanel from "mixpanel-browser";
import { useStytchUser } from "@stytch/react";

type Props = {
  children: ReactNode;
};

const AnalyticsContextProvider: FC<Props> = ({ children }) => {
  const user = useStytchUser();

  useEffect(() => {
    mixpanel.init("d55e0363a01ca94640164c3326c2466e", {
      debug: true,
      track_pageview: true,
      disable_persistence: true,
      disable_cookie: true,
    });
    mixpanel.identify(user.user?.phone_numbers[0].phone_number);
  }, []);

  return (
    <AnalyticsClassContext.Provider value={analyticsClass}>
      {children}
    </AnalyticsClassContext.Provider>
  );
};

export default AnalyticsContextProvider;
