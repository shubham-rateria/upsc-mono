import React from "react";
import styles from "./EmptyPagePlaceholder.module.css";

type Props = {
  title: string;
  description: string;
  imgSrc?: string;
  children?: React.ReactNode;
};

export const EmptyPagePlaceholder: React.FC<Props> = ({
  title,
  description,
  imgSrc,
  children,
}) => {
  return (
    <div className={styles.Container}>
      <div className={styles.Img}>
        <img src={imgSrc} alt={title} />
      </div>
      <div className={styles.Title}>{title}</div>
      <div className={styles.Description}>{description}</div>
      <div>{children}</div>
    </div>
  );
};
