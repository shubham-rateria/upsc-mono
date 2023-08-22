import styles from "./NoMobileView.module.css";

const NoMobileView = () => {
  return (
    <div className={styles.Container}>
      <img src={"/img/logo.svg"} alt="Logo" />
      <p>
        We are building the mobile version of the platform. Please view this on
        your desktop or in landscape mode of your iPad / Tablet.
      </p>
      <p>Apologies for any inconvenience.</p>
    </div>
  );
};

export default NoMobileView;
