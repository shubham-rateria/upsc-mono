import { Button, Dropdown, Menu } from "semantic-ui-react";
import styles from "./TopNavbar.module.css";
import { useCallback, useContext } from "react";
import { useStytchUser, useStytch } from "@stytch/react";
import { useNavigate } from "react-router-dom";
import { TourContext } from "../../contexts/TourContext";

const TopNavBar = () => {
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

  const options = [
    { key: 1, text: "This is a super long item", value: 1 },
    { key: 2, text: "Dropdown direction can help", value: 2 },
    { key: 3, text: "Items are kept within view", value: 3 },
  ];

  return (
    <div className={styles.topNavBar}>
      <div className={styles.logoContainer}>
        <img src={logoUrl} alt="Logo" />
      </div>

      <div className={styles.avatarContainer}>
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
                {/* <Dropdown.Item text="Item 1" /> */}
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Menu>
        {user.user && (
          <>
            {/* <div>
              <Button className={styles.UnlockBtn}>
                <img src="/icons/mdi_crown.svg" />
                Unlock Access
              </Button>
            </div> */}
            <Button onClick={logout} className={styles.LogoutBtn}>
              Logout
            </Button>
          </>
        )}
        {/* <Button circular icon="user" basic color="grey" disabled /> */}
      </div>
    </div>
  );
};

export default TopNavBar;
