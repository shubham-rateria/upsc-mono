import { Button } from "semantic-ui-react";
import styles from "./TopNavbar.module.css";
import { useCallback } from "react";
import { useStytchUser, useStytch } from "@stytch/react";
import { useNavigate } from "react-router-dom";

const TopNavBar = () => {
  const stytchClient = useStytch();
  const user = useStytchUser();
  const navigate = useNavigate();

  console.log({ user });

  const logout = useCallback(async () => {
    await stytchClient.session.revoke();
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
