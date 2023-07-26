import React from 'react';
import styles from './TopNavBar.module.css';

const TopNavBar = () => {
  // Replace the logo URL and avatar URL with your own
  const logoUrl = 'path_to_your_logo.png';
  const avatarUrl = 'path_to_your_avatar.png';

  return (
    <div className={styles.topNavBar}>
      <div className={styles.logoContainer}>
        <img src={logoUrl} alt="Logo" />
      </div>
      <div className={styles.avatarContainer}>
        <img src={avatarUrl} alt="User Avatar" />
      </div>
    </div>
  );
};

export default TopNavBar;