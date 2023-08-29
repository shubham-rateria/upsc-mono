import React, { useState, useRef, FC } from "react";
import styles from "./BottomDrawer.module.css"; // Create a CSS file for styling
import clsx from "clsx";
import { Button } from "semantic-ui-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  iconSrc?: string;
  onApply: () => void;
  onCancel?: () => void;
  onClear?: () => void;
};

const BottomDrawer: FC<Props> = ({
  isOpen,
  onClose,
  children,
  title,
  iconSrc,
  onApply,
  onCancel,
  onClear,
}) => {
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const drawerRef = useRef(null);

  const handleTouchStart = (e: any) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: any) => {
    if (drawerRef.current) {
      // @ts-ignore
      drawerRef.current.style.top = `${e.touches[0].clientY}px`;
    }
    setStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    const deltaY = currentY - startY;

    if (deltaY < -300 && isOpen) {
      //   if (drawerRef.current) {
      //     // @ts-ignore
      //     drawerRef.current.style.top = `100vh`;
      //   }
      //   onClose();
    } else if (deltaY > 300 && !isOpen) {
      if (drawerRef.current) {
        // @ts-ignore
        drawerRef.current.style.top = `100vh`;
      }
      onClose();
    }

    setStartY(0);
    setCurrentY(0);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  const handleApply = () => {
    onApply();
    onClose();
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
      onClose();
    }
  };

  if (!isOpen) {
    return <></>;
  }

  return (
    <>
      <div className={styles.Overlay} onClick={onClose}></div>
      <div
        className={`${styles.Drawer} ${isOpen ? "open" : ""}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={drawerRef}
      >
        <div className={styles.Header}>
          <div className={styles.RectContainer}>
            <div className={styles.Rect} />
          </div>
          <div className={styles.Details}>
            {iconSrc && <img src={iconSrc} />}
            <div className={styles.Title}>{title}</div>
            {onClear && (
              <div className={styles.Clear} onClick={handleClear}>
                Reset
              </div>
            )}
          </div>
        </div>
        <div className={styles.Content}>{children}</div>
        <div className={styles.Actions}>
          <Button className={styles.CancelBtn} onClick={handleCancel}>
            Cancel
          </Button>
          <Button className={styles.ApplyBtn} onClick={handleApply}>
            Apply
          </Button>
        </div>
      </div>
    </>
  );
};

export default BottomDrawer;
