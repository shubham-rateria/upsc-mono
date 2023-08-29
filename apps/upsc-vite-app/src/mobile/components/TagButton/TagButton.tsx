import { FC } from "react";
import { Button, Icon } from "semantic-ui-react";
import styles from "./TagButton.module.css";

type Props = {
  text: string;
  placeholder: string;
  hasValue: boolean;
  iconPath?: string;
  onClick?: () => void;
};

const TagButton: FC<Props> = ({
  text,
  hasValue,
  iconPath,
  placeholder,
  onClick,
}) => {
  return (
    <Button className={styles.Button} icon onClick={onClick}>
      {iconPath ? <img src={iconPath} /> : <></>}
      {hasValue ? text : placeholder}
      {hasValue ? <Icon name="close" /> : <Icon name="dropdown" />}
    </Button>
  );
};

export default TagButton;
