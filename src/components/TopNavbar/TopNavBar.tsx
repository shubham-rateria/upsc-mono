import React from 'react';
import styles from './TopNavBar.module.css';
import { Avatar } from 'antd';

const TopNavBar = () => {
  // Replace the logo URL and avatar URL with your own
  const logoUrl = '/img/logo.svg';
  const avatarUrl = 'path_to_your_avatar.png';

  return (
    <div className={styles.topNavBar}>
      <div className={styles.logoContainer}>
        <img src={logoUrl} alt="Logo" />
      </div>
      <div className={styles.avatarContainer}>
        <div className={styles.PhoneNumber}>+91 79808 43700</div>
        <Avatar />
      </div>
    </div>
  );
};

export default TopNavBar;