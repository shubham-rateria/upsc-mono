import { FC, useContext, useState } from "react";
import BottomDrawer from "../BottomDrawer/BottomDrawer";
import { SearchParamsContext } from "../../../contexts/SearchParamsContext";
import { DocumentType } from "usn-common";
import { Checkbox, List } from "semantic-ui-react";
import styles from "./DocTypeDrawer.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const DocTypeDrawer: FC<Props> = ({ isOpen, onClose }) => {
  const searchParamsClass = useContext(SearchParamsContext);
  const [docType, setDocType] = useState<number>(
    searchParamsClass.searchParams.documentType || -1
  );

  const handleApply = () => {
    searchParamsClass.setSearchParams({
      documentType: docType as DocumentType,
    });
    searchParamsClass.searchForDocuments();
  };

  const handleChange = (type: DocumentType) => {
    setDocType(type);
  };

  return (
    <BottomDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Document Type"
      onApply={handleApply}
    >
      <List className={styles.Container}>
        <List.Item className={styles.ListItem}>
          <List.Content>
            <List.Header className={styles.SectionTitle} onClick={() => {}}>
              <Checkbox
                checked={docType === -1}
                onClick={() => {
                  handleChange(-1);
                }}
                radio
                label="All Documents"
              />
            </List.Header>
          </List.Content>
        </List.Item>
        <List.Item className={styles.ListItem}>
          <List.Content>
            <List.Header
              className={styles.SectionTitle}
              onClick={() => {
                handleChange(0);
              }}
            >
              <Checkbox
                checked={docType === 0}
                onClick={() => {}}
                radio
                label="Notes"
              />
            </List.Header>
          </List.Content>
        </List.Item>
        <List.Item className={styles.ListItem}>
          <List.Content>
            <List.Header
              className={styles.SectionTitle}
              onClick={() => {
                handleChange(1);
              }}
            >
              <Checkbox
                checked={docType === 1}
                onClick={() => {}}
                radio
                label="Sample Answers"
              />
            </List.Header>
          </List.Content>
        </List.Item>
      </List>
    </BottomDrawer>
  );
};

export default DocTypeDrawer;
