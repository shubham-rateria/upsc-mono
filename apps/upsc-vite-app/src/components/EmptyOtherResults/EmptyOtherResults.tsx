import { FC } from "react";
import styles from "./EmptyOtherResults.module.css";

type Props = {
  heading: string;
  description: string;
};

const EmptyOtherResults: FC<Props> = ({ heading, description }) => {
  return (
    <div className={styles.Container}>
      <div className={styles.Graphic}>
        <img src="/img/other-results.svg" />
      </div>
      <div className={styles.Content}>
        <div className={styles.Heading}>{heading}</div>
        <div className={styles.Description}>{description}</div>
      </div>
    </div>
  );
};

export default EmptyOtherResults;
