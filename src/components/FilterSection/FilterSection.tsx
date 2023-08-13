import React, { FC, useEffect, useMemo, useState } from "react";
import gs1Categories from "../../data/gs1-categories";
import gs2Categories from "../../data/gs2-categories";
import gs3Categories from "../../data/gs3-categories";
import gs4categories from "../../data/gs4-categories";
import optionalsCategories from "../../data/optionals-categories";
import { convertToCategoryType } from "@/utils/convert-json-to-category-type";
import {
  List,
  Accordion,
  Icon,
  Checkbox,
  Input,
  Loader,
} from "semantic-ui-react";
import styles from "./FilterSection.module.css";
import { Tag, TagType, Topper } from "@/types";
import clsx from "clsx";
import { SearchParamsContext } from "@/contexts/SearchParamsContext";
import { observer } from "mobx-react-lite";
import axios from "axios";

type Props = {};

type FilterAccordionProps = {
  title: string;
  data: any;
  tagType: TagType;
  showL0Checkbox?: boolean;
  handleCheckboxClick: (tag: Tag) => void;
  iconSrc?: string;
};

const FilterAccordion: FC<FilterAccordionProps> = observer(
  ({
    title,
    data,
    tagType,
    showL0Checkbox = true,
    handleCheckboxClick,
    iconSrc,
  }) => {
    const [active, setActive] = useState(false);
    const searchParamsClass = React.useContext(SearchParamsContext);

    const isCheckboxActive = (tag: Tag) => {
      return searchParamsClass.tagExists(tag);
    };

    const handleL0Click = () => {
      const l0Tag: Tag = {
        level: "l0",
        type: tagType,
        value: {
          tagText: title,
        },
      };
      handleCheckboxClick(l0Tag);
      const selected = searchParamsClass.tagExists(l0Tag);

      data.categories.forEach((category: any) => {
        Object.keys(category).forEach((l1) => {
          const l1Tag: Tag = {
            level: "l1",
            type: tagType,
            value: {
              tagText: l1,
            },
          };
          if (selected) {
            if (!searchParamsClass.tagExists(l1Tag)) {
              searchParamsClass.addSubjectTag(l1Tag);
            }
          } else {
            searchParamsClass.removeSubjectTag(l1Tag);
          }

          Object.keys(category[l1]).forEach((l2) => {
            const l2Tag: Tag = {
              level: "l2",
              type: tagType,
              value: {
                tagText: l2,
              },
            };
            if (selected) {
              if (!searchParamsClass.tagExists(l2Tag)) {
                searchParamsClass.addSubjectTag(l2Tag);
              }
            } else {
              searchParamsClass.removeSubjectTag(l2Tag);
            }
          });
        });
      });
    };

    const handleL1Click = (tag: Tag) => {
      // find the l1 category
      data.categories.map((category: any) => {
        Object.keys(category).map((l1) => {
          if (l1 === tag.value.tagText) {
            handleCheckboxClick(tag);
            const selected = searchParamsClass.tagExists(tag);
            Object.keys(category[l1]).map((l2) => {
              const l2Tag: Tag = {
                level: "l2",
                type: tagType,
                value: {
                  tagText: l2,
                },
              };
              if (selected) {
                if (!searchParamsClass.tagExists(l2Tag)) {
                  searchParamsClass.addSubjectTag(l2Tag);
                }
              } else {
                searchParamsClass.removeSubjectTag(l2Tag);
              }
            });
          }
        });
      });
    };

    const handleL2Click = (tag: Tag) => {
      handleCheckboxClick(tag);
    };

    return (
      <Accordion>
        <Accordion.Title
          active={active}
          onClick={() => {
            setActive(!active);
          }}
          className={clsx(styles.L0Title, active && styles.L0TitleExpanded)}
        >
          {showL0Checkbox ? (
            <Checkbox
              onClick={(e) => {
                e.stopPropagation();
                handleL0Click();
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
          ) : (
            <>
              {iconSrc && <img src={iconSrc} />}
              <div>{title}</div>
            </>
          )}
          {data.categories.length > 0 && <Icon size="large" name="dropdown" />}
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
                <List key={l1} className={styles.ListContainer}>
                  <List.Item
                    className={clsx(
                      styles.ListItem,
                      isCheckboxActive({
                        level: "l1",
                        type: tagType,
                        value: {
                          tagText: l1,
                        },
                      }) && styles.ItemSelected
                    )}
                  >
                    <List.Content>
                      <List.Header
                        className={clsx(styles.SectionTitle)}
                        onClick={() => {
                          handleL1Click({
                            level: "l1",
                            type: tagType,
                            value: {
                              tagText: l1,
                            },
                          });
                        }}
                      >
                        <Checkbox
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
                  <List.Item
                    style={{
                      padding: 0,
                    }}
                  >
                    <List.Content>
                      <List.List className={styles.SubList}>
                        {/* @ts-ignore */}
                        {Object.keys(category[l1]).map((l2: string) => (
                          <List.Item
                            key={l2}
                            className={clsx(
                              styles.ListItem,
                              isCheckboxActive({
                                level: "l2",
                                type: tagType,
                                value: {
                                  tagText: l2,
                                },
                              }) && styles.ItemSelected
                            )}
                          >
                            <List.Content>
                              <List.Header
                                className={clsx(
                                  styles.Selector,
                                  styles.FilterSelect
                                )}
                                onClick={() => {
                                  handleL2Click({
                                    level: "l2",
                                    type: tagType,
                                    value: {
                                      tagText: l2,
                                    },
                                  });
                                }}
                              >
                                <Checkbox
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
  }
);

const TopperFilter: FC = observer(() => {
  const [toppers, setToppers] = useState<Topper[]>([]);
  const [active, setActive] = useState(false);
  const searchParamsClass = React.useContext(SearchParamsContext);
  const [loading, setLoading] = useState(true);

  const handleCheckboxClick = (topper: Topper) => {
    if (searchParamsClass.topperSelected(topper)) {
      searchParamsClass.setSearchParams({
        topper: undefined,
      });
    } else {
      searchParamsClass.setSearchParams({ topper });
    }
  };

  useEffect(() => {
    /**
     * get toppers
     */

    const init = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/toppers");
        setToppers(response.data.data);
      } catch (error) {
        console.error("Error in getting toppers", error);
      }
      setLoading(false);
    };

    init();
  }, []);

  return (
    <Accordion>
      <Accordion.Title
        active={active}
        onClick={() => {
          setActive(!active);
        }}
        className={clsx(styles.L0Title, active && styles.L0TitleExpanded)}
      >
        <img src="/icons/do-ribbon.svg" />
        <div>Toppers</div>
        {loading ? (
          <Loader active inline size="mini" className={styles.Loader} />
        ) : (
          toppers.length > 0 && <Icon size="large" name="dropdown" />
        )}
      </Accordion.Title>
      <Accordion.Content active={active} className={styles.Section}>
        {toppers.length > 0 && (
          <Input
            fluid
            size="small"
            className={styles.Input}
            placeholder="Search for topper"
            icon
          >
            <input />
            <Icon name="close" />
          </Input>
        )}
        <List className={styles.ListContainer}>
          {toppers.map((topper: Topper, index: number) => (
            <List.Item className={clsx(styles.ListItem)} key={index}>
              <List.Content>
                <List.Header
                  className={clsx(styles.SectionTitle)}
                  onClick={() => {}}
                >
                  <Checkbox
                    checked={searchParamsClass.topperSelected(topper)}
                    onClick={() => {
                      handleCheckboxClick(topper);
                    }}
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
      </Accordion.Content>
    </Accordion>
  );
});

const FilterSection: FC<Props> = () => {
  const searchParamsClass = React.useContext(SearchParamsContext);

  const handleCheckboxClick = (tag: Tag) => {
    if (searchParamsClass.tagExists(tag)) {
      searchParamsClass.removeSubjectTag(tag);
    } else {
      searchParamsClass.addSubjectTag(tag);
    }
  };

  return (
    <div className={styles.Container}>
      <div className={styles.FilterSection}>
        <FilterAccordion
          title="General Studies I"
          data={gs1Categories}
          handleCheckboxClick={handleCheckboxClick}
          tagType="GS1"
        />
        <FilterAccordion
          title="General Studies II"
          data={gs2Categories}
          handleCheckboxClick={handleCheckboxClick}
          tagType="GS2"
        />
        <FilterAccordion
          title="General Studies III"
          data={gs3Categories}
          handleCheckboxClick={handleCheckboxClick}
          tagType="GS3"
        />
        <FilterAccordion
          title="General Studies IV"
          data={gs4categories}
          handleCheckboxClick={handleCheckboxClick}
          tagType="GS4"
        />
        <FilterAccordion
          title="Essay"
          data={{ categories: [] }}
          handleCheckboxClick={handleCheckboxClick}
          tagType="Essay"
        />
        <FilterAccordion
          title="Optionals"
          showL0Checkbox={false}
          data={optionalsCategories}
          handleCheckboxClick={handleCheckboxClick}
          tagType="Optionals"
          iconSrc="/icons/do-book.svg"
        />
        <TopperFilter />
      </div>
    </div>
  );
};

export default observer(FilterSection);
