import { Menu, Dropdown, Icon } from "semantic-ui-react";
import styles from "./Topnavbar.module.css";
// import { useCallback, useContext } from "react";
import { useStytch } from "@stytch/react";
import { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { UserContext } from "../../../contexts/UserContextProvider";
// import { useNavigate } from "react-router-dom";
// import { TourContext } from "../../../contexts/TourContext";

const MTopNavBar = observer(() => {
  const stytchClient = useStytch();
  // const stytchUser = useStytchUser();
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [showCopied, setShowCopied] = useState(false);

  const logoUrl = "/img/logo.svg";

  const logout = useCallback(async () => {
    await stytchClient.session.revoke();
    // analyticsClass.triggerLogout({
    //   phone_number: user.user?.phone_numbers[0].phone_number || "",
    //   result: "pass",
    // });
    navigate("/");
  }, [stytchClient]);

  const handleReferralClick = () => {
    if (user.referralCode && user.referralCode.length > 0) {
      navigator.clipboard.writeText(user.referralCode || "");
      setShowCopied(true);
    } else {
      console.error("error copying code");
    }
  };

  return (
    <div className={styles.topNavBar}>
      <div className={styles.logoContainer}>
        <img src={logoUrl} alt="Logo" />
      </div>

      <div className={styles.avatarContainer}>
        <Menu className={styles.TutorialBtn}>
          <Menu.Menu position="right">
            <Dropdown
              item
              simple
              trigger={<Icon name="user" />}
              direction="right"
              className={styles.DropdownBtn}
            >
              <Dropdown.Menu className={styles.DropdownMenu}>
                <Dropdown.Item
                  className={styles.DropdownItem}
                  onClick={handleReferralClick}
                >
                  <div>Referral Code</div>
                  <div className={styles.Code}>{user.referralCode}</div>
                  {showCopied && (
                    <div className={styles.Copied}>Copied to clipboard!</div>
                  )}
                </Dropdown.Item>
                <Dropdown.Item
                  text="Logout"
                  onClick={logout}
                  className={styles.DropdownItem}
                />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Menu>
      </div>
    </div>
  );
});

export default MTopNavBar;
