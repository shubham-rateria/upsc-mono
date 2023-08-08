import React, { FC, useMemo, useState } from "react";
import gs1Categories from "../../data/gs1-categories";
import gs2Categories from "../../data/gs2-categories";
import gs3Categories from "../../data/gs3-categories";
import gs4categories from "../../data/gs4-categories";
import optionalsCategories from "../../data/optionals-categories";
import { convertToCategoryType } from "@/utils/convert-json-to-category-type";
import { List, Accordion, Icon, Checkbox, Input } from "semantic-ui-react";
import styles from "./FilterSection.module.css";
import { Tag, TagType } from "@/types";
import clsx from "clsx";
import { SearchParamsContext } from "@/contexts/SearchParamsContext";

type Props = {};

type FilterAccordionProps = {
  title: string;
  data: any;
  tagType: TagType;
  handleL0Click: (category: string, l0Category: TagType) => void;
  handleL1Click: (category: string, l0Category: TagType) => void;
  handleL2Click: (category: string, l0Category: TagType) => void;
};

const FilterAccordion: FC<FilterAccordionProps> = ({
  title,
  data,
  tagType,
  handleL0Click,
  handleL1Click,
  handleL2Click,
}) => {
  const [active, setActive] = useState(false);
  const searchParamsClass = React.useContext(SearchParamsContext);

  const isCheckboxActive = (tag: Tag) => {
    return (
      tag.level === searchParamsClass.searchParams.tag?.level &&
      tag.type === searchParamsClass.searchParams.tag?.type &&
      tag.value.tagText === searchParamsClass.searchParams.tag?.value.tagText
    );
  };

  return (
    <Accordion>
      <Accordion.Title
        active={active}
        onClick={() => {
          setActive(!active);
        }}
        className={styles.L0Title}
      >
        <Checkbox
          radio
          onClick={(e) => {
            e.stopPropagation();
            handleL0Click(title, tagType);
          }}
          label={title}
          checked={isCheckboxActive({
            level: "l0",
            type: tagType,
            value: {
              tagText: title,
            },
          })}
        />
        {data.categories.length > 0 && <Icon name="dropdown" />}
      </Accordion.Title>
      <Accordion.Content active={active} className={styles.Section}>
        {data.categories.length > 0 && (
          <Input
            fluid
            size="small"
            className={styles.Input}
            placeholder="Search for topic"
            icon
          >
            <input />

            <Icon name="close" />
          </Input>
        )}
        {data.categories.map((category: any, index: number) => (
          <>
            {Object.keys(category).map((l1: any) => (
              <List key={l1}>
                <List.Item>
                  <List.Content>
                    <List.Header
                      className={clsx(styles.SectionTitle)}
                      onClick={() => {
                        handleL1Click(l1, tagType);
                      }}
                    >
                      <Checkbox
                        radio
                        label={l1}
                        checked={isCheckboxActive({
                          level: "l1",
                          type: tagType,
                          value: {
                            tagText: l1,
                          },
                        })}
                      />
                    </List.Header>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.List className={styles.SubList}>
                      {/* @ts-ignore */}
                      {Object.keys(category[l1]).map((l2: string) => (
                        <List.Item key={l2} className={styles.ListItem}>
                          <List.Content>
                            <List.Header
                              className={clsx(
                                styles.Selector,
                                styles.FilterSelect
                              )}
                              onClick={() => {
                                handleL2Click(l2, tagType);
                              }}
                            >
                              <Checkbox
                                radio
                                label={l2}
                                checked={isCheckboxActive({
                                  level: "l2",
                                  type: tagType,
                                  value: {
                                    tagText: l2,
                                  },
                                })}
                              />
                            </List.Header>
                          </List.Content>
                        </List.Item>
                      ))}
                    </List.List>
                  </List.Content>
                </List.Item>
              </List>
            ))}
          </>
        ))}
      </Accordion.Content>
    </Accordion>
  );
};

const FilterSection: FC<Props> = () => {
  const searchParamsClass = React.useContext(SearchParamsContext);
  const [filterOption, setFilterOption] = useState("");
  const [currentActiveL0, setCurrentActiveL0] = useState(0);
  const gs1FilterCategories = useMemo(() => {
    return convertToCategoryType(gs1Categories.categories[0]);
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOption(event.target.value);
  };

  const handleL0Click = (tagText: string, type: TagType) => {
    const tag: Tag = {
      level: "l0",
      type,
      value: {
        tagText,
      },
    };
    searchParamsClass.setSearchParams({
      tag,
    });
  };

  const handleL1Click = (tagText: string, type: TagType) => {
    const tag: Tag = {
      level: "l1",
      type,
      value: {
        tagText,
      },
    };
    searchParamsClass.setSearchParams({
      tag,
    });
  };

  const handleL2Click = (tagText: string, type: TagType) => {
    const tag: Tag = {
      level: "l2",
      type,
      value: {
        tagText,
      },
    };
    searchParamsClass.setSearchParams({
      tag,
    });
  };

  return (
    <div className={styles.Container}>
      <div className={styles.FilterSection}>
        <FilterAccordion
          title="General Studies I"
          data={gs1Categories}
          handleL0Click={handleL0Click}
          handleL1Click={handleL1Click}
          handleL2Click={handleL2Click}
          tagType="GS1"
        />
        <FilterAccordion
          title="General Studies II"
          data={gs2Categories}
          handleL0Click={handleL0Click}
          handleL1Click={handleL1Click}
          handleL2Click={handleL2Click}
          tagType="GS2"
        />
        <FilterAccordion
          title="General Studies III"
          data={gs3Categories}
          handleL0Click={handleL0Click}
          handleL1Click={handleL1Click}
          handleL2Click={handleL2Click}
          tagType="GS3"
        />
        <FilterAccordion
          title="General Studies IV"
          data={gs4categories}
          handleL0Click={handleL0Click}
          handleL1Click={handleL1Click}
          handleL2Click={handleL2Click}
          tagType="GS4"
        />
        <FilterAccordion
          title="Essay"
          data={{ categories: [] }}
          handleL0Click={handleL0Click}
          handleL1Click={handleL1Click}
          handleL2Click={handleL2Click}
          tagType="Essay"
        />
        <FilterAccordion
          title="Optionals"
          data={optionalsCategories}
          handleL0Click={handleL0Click}
          handleL1Click={handleL1Click}
          handleL2Click={handleL2Click}
          tagType="Optionals"
        />
      </div>
    </div>
  );
};

export default FilterSection;
