import { FC, useContext, useEffect, useState } from "react";
import BottomDrawer from "../BottomDrawer/BottomDrawer";
import { Topper } from "usn-common";
import { SearchParamsContext } from "../../../contexts/SearchParamsContext";
import axiosInstance from "../../../utils/axios-instance";
import { Button, Checkbox, Icon, Input, List } from "semantic-ui-react";
import clsx from "clsx";
import styles from "./TopperDrawer.module.css";
import { observer } from "mobx-react-lite";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const TopperDrawer: FC<Props> = ({ isOpen, onClose }) => {
  const [toppers, setToppers] = useState<Topper[]>([]);
  const searchParamsClass = useContext(SearchParamsContext);
  const [_loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [selectedTopper, setSelectedTopper] = useState<Topper>();

  const handleCheckboxClick = (topper: Topper) => {
    setSelectedTopper(topper);
  };

  const handleApply = () => {
    searchParamsClass.setSearchParams({
      topper: selectedTopper,
    });
  };

  useEffect(() => {
    /**
     * get toppers
     */

    const init = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/api/toppers");
        setToppers(response.data.data);
      } catch (error) {
        console.error("Error in getting toppers", error);
      }
      setLoading(false);
    };

    init();
  }, []);

  return (
    <BottomDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Toppers"
      iconSrc="/icons/do-filter-circle.svg"
      onApply={() => {
        handleApply();
      }}
      onClear={
        searchParamsClass.searchParams.topper
          ? () => {
              searchParamsClass.setSearchParams({
                topper: undefined,
              });
            }
          : undefined
      }
    >
      {toppers.length > 0 && (
        <>
          <Input
            fluid
            size="small"
            className={styles.Input}
            placeholder="Search for topper"
            icon
            onChange={(e) => {
              setFilterText(e.target.value);
            }}
            value={filterText}
          >
            <input />
            <Button
              basic
              icon
              size="small"
              className={styles.CloseBtn}
              onClick={() => {
                setFilterText("");
              }}
            >
              <Icon name="close" />
            </Button>
          </Input>
        </>
      )}
      <List className={styles.ListContainer}>
        {(filterText.length > 0
          ? toppers.filter((t) => t.name?.toLowerCase().includes(filterText))
          : toppers
        ).map((topper: Topper, index: number) => (
          <List.Item className={clsx(styles.ListItem)} key={index}>
            <List.Content>
              <List.Header
                className={clsx(styles.SectionTitle)}
                onClick={() => {}}
              >
                <Checkbox
                  checked={
                    selectedTopper?.name === topper.name &&
                    selectedTopper?.rank === topper.rank &&
                    selectedTopper?.year === topper.year
                  }
                  onClick={() => {
                    handleCheckboxClick(topper);
                  }}
                  radio
                />
                <div className={styles.TopperListItem}>
                  <div className={styles.Name}>{topper.name}</div>
                  <div className={styles.Details}>
                    AIR {topper.rank} {topper.year}
                  </div>
                </div>
              </List.Header>
            </List.Content>
          </List.Item>
        ))}
      </List>
    </BottomDrawer>
  );
};

export default observer(TopperDrawer);
