import React, { FC, useMemo, useState } from "react";
import gs1Categories from "../../data/gs1-categories";
import gs2Categories from "../../data/gs2-categories";
import { convertToCategoryType } from "@/utils/convert-json-to-category-type";
import { List, Accordion, Icon, Checkbox, Input } from "semantic-ui-react";
import styles from "./FilterSection.module.css";
import { Tag, TagType } from "@/types";
import clsx from "clsx";

type Props = {
  onFilter: (filterOption: Tag) => void;
};

type FilterAccordionProps = {
  title: string;
  data: any;
  tagType: TagType;
  handleL0Click?: (l0Category: string) => void;
  handleL1Click: (category: string, l0Category: TagType) => void;
  handleL2Click: (category: string, l0Category: TagType) => void;
};

const FilterAccordion: FC<FilterAccordionProps> = ({
  title,
  data,
  handleL1Click,
  handleL2Click,
}) => {
  const [active, setActive] = useState(false);

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
          }}
          label={title}
        />{" "}
        {data.categories.length > 0 && <Icon name="dropdown" />}
      </Accordion.Title>
      <Accordion.Content active={active} className={styles.Section}>
        {data.categories.length > 0 && (
          <Input fluid size="small" className={styles.Input} placeholder="Search for topic"  />
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
                        handleL1Click(l1, "GS1");
                      }}
                    >
                      <Checkbox radio label={l1} />
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
                                handleL2Click(l2, "GS1");
                              }}
                            >
                              <Checkbox radio label={l2} />
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

const FilterSection: FC<Props> = ({ onFilter }) => {
  const [filterOption, setFilterOption] = useState("");
  const [currentActiveL0, setCurrentActiveL0] = useState(0);
  const gs1FilterCategories = useMemo(() => {
    return convertToCategoryType(gs1Categories.categories[0]);
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOption(event.target.value);
  };

  const handleL1Click = (tagText: string, type: TagType) => {
    const tag: Tag = {
      level: "l1",
      type,
      value: {
        tagText,
      },
    };
    onFilter(tag);
  };

  const handleL2Click = (tagText: string, type: TagType) => {
    const tag: Tag = {
      level: "l2",
      type,
      value: {
        tagText,
      },
    };
    onFilter(tag);
  };

  return (
    <div className={styles.Container}>
      <div className={styles.FilterSection}>
        <FilterAccordion
          title="General Studies I"
          data={gs1Categories}
          handleL1Click={handleL1Click}
          handleL2Click={handleL2Click}
          tagType="GS1"
        />
        <FilterAccordion
          title="General Studies II"
          data={gs2Categories}
          handleL1Click={handleL1Click}
          handleL2Click={handleL2Click}
          tagType="GS2"
        />
         <FilterAccordion
          title="General Studies III"
          data={gs2Categories}
          handleL1Click={handleL1Click}
          handleL2Click={handleL2Click}
          tagType="GS2"
        />
         <FilterAccordion
          title="General Studies IV"
          data={gs2Categories}
          handleL1Click={handleL1Click}
          handleL2Click={handleL2Click}
          tagType="GS2"
        />
        <FilterAccordion
          title="Essay"
          data={{ categories: [] }}
          handleL1Click={handleL1Click}
          handleL2Click={handleL2Click}
          tagType="Essay"
        />
      </div>
    </div>
  );
};

export default FilterSection;
