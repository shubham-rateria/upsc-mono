import { Button } from "semantic-ui-react";
import styles from "./TopNavbar.module.css";
import { useCallback, useContext, useState } from "react";
import { useStytchUser, useStytch } from "@stytch/react";
import { useNavigate } from "react-router-dom";
import { AnalyticsClassContext } from "../../analytics/AnalyticsClass";
import ReferralModal from "../ReferralModal/ReferralModal";

const TopNavBar = () => {
  const stytchClient = useStytch();
  const user = useStytchUser();
  const navigate = useNavigate();
  const analyticsClass = useContext(AnalyticsClassContext);

  const [openReferModal, setOpenReferModal] = useState(false);

  const handleReferModalClose = () => {
    setOpenReferModal(false);
  };

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
      <ReferralModal open={openReferModal} onClose={handleReferModalClose} />
      <div className={styles.logoContainer}>
        <img src={logoUrl} alt="Logo" />
      </div>

      <div className={styles.avatarContainer}>
        {user.user && (
          <div>
            <Button
              onClick={() => {
                setOpenReferModal(true);
              }}
              className={styles.ReferBtn}
            >
              Refer
            </Button>
          </div>
        )}
        {user.user && (
          <div>
            <Button onClick={logout} className={styles.LogoutBtn}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopNavBar;
