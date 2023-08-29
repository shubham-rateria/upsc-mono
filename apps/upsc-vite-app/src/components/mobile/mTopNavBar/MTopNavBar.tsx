import { Button, Dropdown, Menu } from "semantic-ui-react";
import styles from "./mTopNavBar.module.css";
import { useCallback, useContext } from "react";
import { useStytchUser, useStytch } from "@stytch/react";
import { useNavigate } from "react-router-dom";
import { TourContext } from "../../../contexts/TourContext";

const MTopNavBar = () => {
  const stytchClient = useStytch();
  const user = useStytchUser();
  const navigate = useNavigate();
  const tourContextController = useContext(TourContext);

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

      {/* <div className={styles.avatarContainer}>
        <Menu className={styles.TutorialBtn}>
          <Menu.Menu
            position="right"
            style={{
              zIndex: 100,
            }}
          >
            <Dropdown
              item
              simple
              text="How to use SmartNotes"
              direction="right"
              className={styles.DropdownBtn}
            >
              <Dropdown.Menu className={styles.DropdownMenu}>
                <Dropdown.Item
                  text="Search for a subject"
                  onClick={() => {
                    tourContextController.startTour1();
                  }}
                  className={styles.DropdownItem}
                />
                <Dropdown.Item
                  text="Search for a specific topic"
                  onClick={() => {
                    tourContextController.startTour2();
                  }}
                />
                <Dropdown.Item
                  text="Search for a toppers documents"
                  onClick={() => {
                    tourContextController.startTour3();
                  }}
                />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Menu>
        {user.user && (
          <>
            <Button onClick={logout} className={styles.LogoutBtn}>
              Logout
            </Button>
          </>
        )}
      </div> */}
    </div>
  );
};

export default MTopNavBar;
