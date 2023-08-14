"use client";

import React from "react";
import styles from "./layout.module.css";
import TopNavBar from "@/components/TopNavbar/TopNavBar";
import SearchParamsContextProvider from "@/contexts/SearchParamsContextProvider";

export default function TopBarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.Container}>
      <SearchParamsContextProvider>
        <div className={styles.TopNavContainer}>
          <TopNavBar />
        </div>
        <div className={styles.Children}>{children}</div>
      </SearchParamsContextProvider>
    </div>
  );
}
