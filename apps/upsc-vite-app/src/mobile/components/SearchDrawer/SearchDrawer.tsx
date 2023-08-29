import { FC, useContext, useMemo, useState } from "react";
import BottomDrawer from "../BottomDrawer/BottomDrawer";
import { Dropdown, Input } from "semantic-ui-react";
import {
  optionalsCategories,
  mapTagTypeToNumber,
  Tag,
  TagType,
} from "usn-common";
import { observer } from "mobx-react-lite";
import { SearchParamsContext } from "../../../contexts/SearchParamsContext";
import styles from "./SearchDrawer.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const SearchDrawer: FC<Props> = ({ isOpen, onClose }) => {
  const searchParamsClass = useContext(SearchParamsContext);
  const [selectedL0, setSelectedL0] = useState(
    (searchParamsClass.searchParams.subjectTags ?? []).length > 0
      ? // @ts-ignore
        searchParamsClass.searchParams.subjectTags[0].value.tagText
      : ""
  );
  const [searchKeyword, setSearchKeyword] = useState<string>();

  const options = useMemo(() => {
    const options = [
      { key: "GS1", value: "GS1", text: "General Studies I" },
      { key: "GS2", value: "GS2", text: "General Studies II" },
      { key: "GS3", value: "GS3", text: "General Studies III" },
      { key: "GS4", value: "GS4", text: "General Studies IV" },
      { key: "Essay", value: "Essay", text: "Essay" },
    ];
    const optionals = optionalsCategories.categories.map((category: any) => {
      const value = Array.from(Object.keys(category))[0];
      return {
        key: value,
        value: value,
        text: value,
      };
    });

    return options.concat(optionals);
  }, []);

  //   const keywordOptions = useMemo(() => {
  //     if (selectedL0 === "") {
  //       return {};
  //     }
  //   }, [selectedL0]);

  const handleL0Change = (_e: any, data: any) => {
    setSelectedL0(data.value);
  };

  const handleApply = () => {
    if (searchKeyword) {
      searchParamsClass.setSearchParams({
        keyword: searchKeyword,
      });
    }

    if (selectedL0 !== "") {
      if (!["GS1", "GS2", "GS3", "GS4", "Essay"].includes(selectedL0)) {
        const tag: Tag = {
          level: "l0",
          type: "Optionals",
          optionalsId: mapTagTypeToNumber[selectedL0],
          value: {
            tagText: selectedL0,
          },
        };
        searchParamsClass.setSearchParams({
          subjectTags: [tag],
        });
      } else {
        const tag: Tag = {
          level: "l0",
          type: selectedL0 as TagType,
          value: {
            tagText: selectedL0,
          },
        };
        searchParamsClass.setSearchParams({
          subjectTags: [tag],
        });
      }
    }

    searchParamsClass.searchForDocuments();
  };

  return (
    <BottomDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Search"
      onApply={() => {
        handleApply();
      }}
    >
      <div className={styles.DrawerContainer}>
        <Dropdown
          fluid
          search
          selection
          clearable
          options={options}
          onChange={handleL0Change}
          placeholder="Search for subject"
          className={styles.Input}
          value={selectedL0}
        />
        <Input
          fluid
          placeholder="Search for a keyword or subtopic"
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.target.value);
          }}
          className={styles.Input}
        />
      </div>
    </BottomDrawer>
  );
};

export default observer(SearchDrawer);
