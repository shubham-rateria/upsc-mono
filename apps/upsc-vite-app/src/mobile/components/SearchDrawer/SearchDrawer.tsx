import { FC, useContext, useMemo, useState } from "react";
import BottomDrawer from "../BottomDrawer/BottomDrawer";
import { Dropdown, Input } from "semantic-ui-react";
import {
  optionalsCategories,
  mapTagTypeToNumber,
  Tag,
  TagType,
  mapTagTypeToCategories,
} from "usn-common";
import { observer } from "mobx-react-lite";
import { SearchParamsContext } from "../../../contexts/SearchParamsContext";
import styles from "./SearchDrawer.module.css";
import { escapeRegExp } from "lodash";

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
  const [searchKeyword, setSearchKeyword] = useState<string>(
    searchParamsClass.searchParams.keyword
      ? searchParamsClass.searchParams.keyword
      : ""
  );

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

  const keywordOptions: Tag[] = useMemo(() => {
    if (selectedL0 === "" || searchKeyword === "") {
      return [];
    }
    const options: Tag[] = [];
    const re = new RegExp(escapeRegExp(searchKeyword), "i");
    if (["GS1", "GS2", "GS3", "GS4", "Essay"].includes(selectedL0)) {
      const categoryType = mapTagTypeToCategories[selectedL0];
      for (const category of categoryType.categories) {
        Object.keys(category).forEach((key) => {
          const option: Tag = {
            type: selectedL0 as TagType,
            level: "l1",
            value: {
              tagText: key,
            },
          };
          if (re.test(key)) {
            options.push(option);
          }
          Object.keys(category[key]).forEach((subKey) => {
            const option: Tag = {
              type: selectedL0 as TagType,
              level: "l2",
              value: {
                tagText: subKey,
              },
            };
            if (re.test(subKey)) {
              options.push(option);
            }
          });
        });
      }
    }
    return options;
  }, [selectedL0, searchKeyword]);

  const handleL0Change = (_e: any, data: any) => {
    setSelectedL0(data.value);
    if (data.value === "") {
      searchParamsClass.setSearchParams({
        subjectTags: [],
        keyword: undefined,
      });
      setSearchKeyword("");
    }
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

  const handleKeywordTagClick = (tag: Tag) => {
    searchParamsClass.setSearchParams({
      subjectTags: [tag],
    });
    setSearchKeyword(tag.value.tagText);
  };

  return (
    <BottomDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Search"
      onApply={() => {
        handleApply();
      }}
      onClear={() => {
        searchParamsClass.setSearchParams({
          keyword: undefined,
          subjectTags: undefined,
        });
        searchParamsClass.searchForDocuments();
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
      <div className={styles.KeywordFilterContainer}>
        {keywordOptions.map((tag: Tag, index: number) => (
          <div
            className={styles.KeywordFilterItem}
            key={index}
            onClick={() => {
              handleKeywordTagClick(tag);
            }}
          >
            {tag.level === "l1" ? tag.value.tagText : `${tag.value.tagText}`}
          </div>
        ))}
      </div>
    </BottomDrawer>
  );
};

export default observer(SearchDrawer);
