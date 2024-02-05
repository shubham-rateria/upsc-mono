import { useContext, type FC, useState } from "react";
import { Modal } from "semantic-ui-react";
import { UserContext } from "../../contexts/UserContextProvider";
import styles from "./ReferralModal.module.css";
import { AnalyticsClassContext } from "../../analytics/AnalyticsClass";

type Props = {
  open: boolean;
  onClose: () => void;
  accessFrom: number;
};

const ReferralModal: FC<Props> = ({ open, onClose, accessFrom }) => {
  const user = useContext(UserContext);
  const analyticsClass = useContext(AnalyticsClassContext);
  const [showCopied, setShowCopied] = useState(false);

  const handleIconClick = () => {
    if (user.referralCode && user.referralCode.length > 0) {
      navigator.clipboard.writeText(user.referralCode || "");
      analyticsClass.triggerReferNowCopied({
        accessed_from: accessFrom,
        downloads_left: user.remainingDownloads.free,
        free_downloads_left: user.remainingDownloads.free,
        referral_code: user.referralCode,
        user_type: 0,
        paid_downloads_left: 0,
      });
      setShowCopied(true);
    } else {
      console.error("error copying code");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Content className={styles.Container}>
        <div className={styles.Logo}>
          <img src="/img/logo.svg" />
        </div>
        <div className={styles.Description}>
          Copy your referral code and share with your friends. Once they login
          to UPSC SmartNotes, we will add free downloads to your account
        </div>
        <div className={styles.CodeContainer}>
          <div className={styles.Code}>{user.referralCode}</div>
          <div className={styles.Icon} onClick={handleIconClick}>
            <img src="/icons/do-copy.svg" />
          </div>
          {showCopied && (
            <div className={styles.Copied}>Copied to clipboard!</div>
          )}
        </div>
      </Modal.Content>
    </Modal>
  );
};

export default ReferralModal;
