import { Button, Image } from "semantic-ui-react";
import styles from "./TopNavbar.module.css";

const TopNavBar = () => {
  const logoUrl = "/img/logo.svg";

  return (
    <div className={styles.topNavBar}>
      <div className={styles.logoContainer}>
        <img src={logoUrl} alt="Logo" />
      </div>
      <div className={styles.avatarContainer}>
        <div>
          <Button className={styles.UnlockBtn}>
            <img src="/icons/mdi_crown.svg" />
            Unlock Access
          </Button>
        </div>
        <Image
          src="https://react.semantic-ui.com/images/wireframe/square-image.png"
          avatar
        />
      </div>
    </div>
  );
};

export default TopNavBar;
