import { FC, ReactNode, useEffect } from "react";
import { AnalyticsClassContext, analyticsClass } from "./AnalyticsClass";
import mixpanel from "mixpanel-browser";
import { useStytchUser } from "@stytch/react";
import config from "../config";

type Props = {
  children: ReactNode;
};

const AnalyticsContextProvider: FC<Props> = ({ children }) => {
  const user = useStytchUser();

  useEffect(() => {
    mixpanel.init(config.MIXPANEL_PROJECT_ID, {
      debug: true,
      track_pageview: true,
      disable_persistence: true,
      disable_cookie: true,
    });
    mixpanel.identify(user.user?.phone_numbers[0].phone_number);
  }, [user.user?.phone_numbers]);

  return (
    <AnalyticsClassContext.Provider value={analyticsClass}>
      {children}
    </AnalyticsClassContext.Provider>
  );
};

export default AnalyticsContextProvider;
