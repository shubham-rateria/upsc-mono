import styles from "./EmptyPagePlaceholder.module.css";

type Props = {
  title: string;
  description: string;
  imgSrc?: string;
};

export const EmptyPagePlaceholder: React.FC<Props> = ({
  title,
  description,
  imgSrc,
}) => {
  return (
    <div className={styles.Container}>
      <div className={styles.Img}>
        <img src={imgSrc} alt={title} />
      </div>
      <div className={styles.Title}>{title}</div>
      <div className={styles.Description}>{description}</div>
    </div>
  );
};
