import React, { FC, useMemo, useState } from "react";
import styles from "./SearchBar.module.css";
import { Button, Dropdown, Input } from "semantic-ui-react";
import { SearchParamsContext } from "../../contexts/SearchParamsContext";
import { observer } from "mobx-react-lite";
import {
  Tag,
  TagType,
  mapTagTypeToCategories,
  mapTagTypeToNumber,
  optionalsCategories,
} from "usn-common";
import { escapeRegExp } from "lodash";
import { AnalyticsClassContext } from "../../analytics/AnalyticsClass";

/**
 * The search bar should return the complete parameters for keyword search
 * @param param0
 * @returns
 */
const SearchBar: FC = observer(() => {
  const searchParamsClass = React.useContext(SearchParamsContext);
  const analyticsClass = React.useContext(AnalyticsClassContext);

  const [selectedL0, setSelectedL0] = useState("");
  const [searchKeyword, setSearchKeyword] = useState<string>(
    searchParamsClass.searchParams.keyword
      ? searchParamsClass.searchParams.keyword
      : ""
  );

  /**
   *
   * @param event change event
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    searchParamsClass.setSearchParams({
      subjectTags: [],
    });
    setSearchKeyword(event.target.value);
  };

  const handleSearch = () => {
    if (
      (searchParamsClass.searchParams.subjectTags || []).length === 0 &&
      searchKeyword.length > 0
    ) {
      searchParamsClass.setSearchParams({
        keyword: searchKeyword,
      });
    }
    if (
      selectedL0 !== "" &&
      (searchParamsClass.searchParams.subjectTags || []).length === 0
    ) {
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
    // searchParamsClass.setSearchParams({ keyword: inputText });
    searchParamsClass.searchForDocuments();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  const handleL0Change = (_e: any, data: any) => {
    if (data.value !== "") {
      if (!["GS1", "GS2", "GS3", "GS4", "Essay"].includes(data.value)) {
        const tag: Tag = {
          level: "l0",
          type: "Optionals",
          optionalsId: mapTagTypeToNumber[data.value],
          value: {
            tagText: data.value,
          },
        };
        searchParamsClass.setSearchParams({
          subjectTags: [tag],
        });
      } else {
        const tag: Tag = {
          level: "l0",
          type: data.value as TagType,
          value: {
            tagText: data.value,
          },
        };
        searchParamsClass.setSearchParams({
          subjectTags: [tag],
        });
      }

      analyticsClass.triggerSubjectSelected({
        subject_selected: data.value,
      });
    } else {
      searchParamsClass.setSearchParams({
        subjectTags: [],
      });
      analyticsClass.triggerSubjectRemoved({ subject_selected: selectedL0 });
    }
    setSelectedL0(data.value);
    setSearchKeyword("");
    searchParamsClass.setSearchParams({
      keyword: undefined,
      topper: undefined,
      documentType: -1,
    });
    searchParamsClass.searchForDocuments();
  };

  const handleKeywordTagClick = (tag: Tag) => {
    searchParamsClass.setSearchParams({
      subjectTags: [tag],
      keyword: undefined,
    });
    setSearchKeyword(tag.value.tagText);
    searchParamsClass.searchForDocuments();
  };

  const handleInputClear = () => {
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
    searchParamsClass.setSearchParams({
      keyword: undefined,
      topper: undefined,
    });
    searchParamsClass.searchForDocuments();
    setSearchKeyword("");
  };

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
    if (selectedL0 === "" || searchKeyword === "" || selectedL0 === "Essay") {
      return [];
    }
    const options: Tag[] = [];
    const re = new RegExp(escapeRegExp(searchKeyword), "i");
    if (["GS1", "GS2", "GS3", "GS4"].includes(selectedL0)) {
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
    } else {
      optionalsCategories.categories.forEach((category) => {
        const keys = Array.from(Object.keys(category));
        if (keys.includes(selectedL0)) {
          const values = Array.from(Object.values(category));
          Object.keys(values[0]).forEach((key) => {
            const option: Tag = {
              level: "l1",
              type: "Optionals",
              optionalsId: mapTagTypeToNumber[selectedL0],
              optionalsName: selectedL0,
              value: {
                tagText: key,
              },
            };
            if (re.test(key)) {
              options.push(option);
            }
          });
        }
      });
    }
    return options;
  }, [selectedL0, searchKeyword]);

  return (
    <div className={styles.Container}>
      <div>
        <Dropdown
          placeholder="Select Subject"
          selection
          search
          clearable
          options={options}
          className={styles.SubjectDropdown}
          onChange={handleL0Change}
          id="subject-select-dropdown"
        />
      </div>
      <div
        style={{
          position: "relative",
        }}
      >
        <Input
          type="text"
          icon="search"
          iconPosition="left"
          placeholder="Search for specific topics, e.g. Indus Valley..."
          value={searchKeyword}
          onChange={handleChange}
          className={styles.Input}
          id="search-input"
          onKeyPress={handleKeyPress}
          fluid
        />
        {searchKeyword.length > 0 && (
          <Button
            icon="close"
            className={styles.InputCloseBtn}
            onClick={handleInputClear}
          />
        )}
        {keywordOptions.length > 0 &&
          (searchParamsClass.searchParams.subjectTags || []).length === 0 && (
            <div className={styles.Suggestions} id="suggestions">
              {keywordOptions.map((tag: Tag, index: number) => (
                <div
                  className={styles.KeywordFilterItem}
                  key={index}
                  onClick={() => {
                    handleKeywordTagClick(tag);
                  }}
                >
                  {tag.level === "l1"
                    ? tag.value.tagText
                    : `${tag.value.tagText}`}
                </div>
              ))}
            </div>
          )}
      </div>
      <Button
        onClick={handleSearch}
        className={styles.Button}
        loading={searchParamsClass.searching}
        id="search-btn"
      >
        Search
      </Button>
    </div>
  );
});

export default SearchBar;
