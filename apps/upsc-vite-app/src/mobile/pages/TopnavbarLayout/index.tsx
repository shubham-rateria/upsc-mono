import React from "react";
import styles from "./layout.module.css";
import MTopNavBar from "../../components/TopnavBar/TopnavBar";

export default function MTopBarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.Container}>
      <div className={styles.TopNavContainer}>
        <MTopNavBar />
      </div>
      <div className={styles.Children}>{children}</div>
    </div>
  );
}
