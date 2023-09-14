import { Button } from "semantic-ui-react";
import styles from "./TopNavbar.module.css";
import { useCallback, useContext } from "react";
import { useStytchUser, useStytch } from "@stytch/react";
import { useNavigate } from "react-router-dom";
import { AnalyticsClassContext } from "../../analytics/AnalyticsClass";

const TopNavBar = () => {
  const stytchClient = useStytch();
  const user = useStytchUser();
  const navigate = useNavigate();
  const analyticsClass = useContext(AnalyticsClassContext);

  console.log({ user });

  const logout = useCallback(async () => {
    await stytchClient.session.revoke();
    analyticsClass.triggerLogout({
      phone_number: user.user?.phone_numbers[0].phone_number || "",
      result: "pass",
    });
    navigate("/");
  }, [stytchClient]);

  const logoUrl = "/img/logo.svg";

  return (
    <div className={styles.topNavBar}>
      <div className={styles.logoContainer}>
        <img src={logoUrl} alt="Logo" />
      </div>

      <div className={styles.avatarContainer}>
        {user.user && (
          <>
            <Button onClick={logout} className={styles.LogoutBtn}>
              Logout
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TopNavBar;
