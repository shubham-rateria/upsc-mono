import { useStytchUser } from "@stytch/react";
import { type FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export const AuthContext: FC<Props> = ({ children }) => {
  const user = useStytchUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.user) {
      navigate("/");
    }
  }, []);

  if (!user.user) {
    return <>no user</>;
  } else {
    return <>{children}</>;
  }
};
