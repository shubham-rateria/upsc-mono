import React from 'react';
import styles from "./layout.module.css";
import TopNavBar from '@/components/TopNavbar/TopNavBar';

export default function TopBarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.Container}>
        <div className={styles.TopNavContainer}>
            <TopNavBar />
        </div>
        <div className={styles.Children}>
            {children}
        </div>
    </div>
  );
}
