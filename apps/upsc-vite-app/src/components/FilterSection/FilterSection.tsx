import React, { FC, useEffect, useState } from "react";
import {
  gs1Categories,
  gs2Categories,
  gs3Categories,
  gs4Categories,
  optionalsCategories,
  type Tag,
  type TagType,
  type Topper,
} from "usn-common";
import {
  List,
  Accordion,
  Icon,
  Checkbox,
  Input,
  Loader,
  Button,
} from "semantic-ui-react";
import styles from "./FilterSection.module.css";
import clsx from "clsx";
import { SearchParamsContext } from "../../contexts/SearchParamsContext";
import { observer } from "mobx-react-lite";
import axiosInstance from "../../utils/axios-instance";
import filterCategories from "../../utils/filter-categories";

type FilterAccordionProps = {
  title: string;
  data: any;
  tagType: TagType;
  showL0Checkbox?: boolean;
  handleCheckboxClick: (tag: Tag) => void;
  iconSrc?: string;
};

export const mapOptionalToNumber: any = {
  Agriculture: 17,
  Anthropology: 6,
  Chemistry: 7,
  Economics: 8,
  Geography: 9,
  Hindi: 10,
  Law: 11,
  Management: 12,
  Philosophy: 13,
  "Political Science": 14,
  "Public Administration": 15,
  Sociology: 16,
  Essay: 5,
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
    const [filterSearchText, setFilterSearchText] = useState<string>("");

    const isCheckboxActive = (tag: Tag, parent1Tag?: Tag, parent2Tag?: Tag) => {
      return (
        searchParamsClass.tagExists(tag) ||
        (parent1Tag ? searchParamsClass.tagExists(parent1Tag) : false) ||
        (parent2Tag ? searchParamsClass.tagExists(parent2Tag) : false)
      );
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
            if (searchParamsClass.tagExists(l1Tag)) {
              searchParamsClass.removeSubjectTag(l1Tag);
            }
          } else {
            // searchParamsClass.removeSubjectTag(l1Tag);
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
              if (searchParamsClass.tagExists(l2Tag)) {
                searchParamsClass.removeSubjectTag(l2Tag);
              }
            } else {
              // searchParamsClass.removeSubjectTag(l2Tag);
            }
          });
        });
      });

      searchParamsClass.searchForDocuments();
    };

    const handleL1Click = (tag: Tag) => {
      const l0Tag: Tag = {
        level: "l0",
        type: tagType,
        value: {
          tagText: title,
        },
      };
      const l0selected = searchParamsClass.tagExists(l0Tag);

      if (l0selected) {
        searchParamsClass.removeSubjectTag(l0Tag);
      }

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
                if (searchParamsClass.tagExists(l2Tag)) {
                  searchParamsClass.removeSubjectTag(l2Tag);
                }
              } else {
                // searchParamsClass.removeSubjectTag(l2Tag);
              }
            });
          }
        });
      });

      searchParamsClass.searchForDocuments();
    };

    const handleL2Click = (tag: Tag, l1Tag?: Tag) => {
      const l0Tag: Tag = {
        level: "l0",
        type: tagType,
        value: {
          tagText: title,
        },
      };
      const l0selected = searchParamsClass.tagExists(l0Tag);

      if (l0selected) {
        searchParamsClass.removeSubjectTag(l0Tag);
      }

      if (l1Tag) {
        const l1Selected = searchParamsClass.tagExists(l1Tag);

        if (l1Selected) {
          searchParamsClass.removeSubjectTag(l1Tag);
        }
      }

      handleCheckboxClick(tag);
      searchParamsClass.searchForDocuments();
    };

    return (
      <Accordion>
        <Accordion.Title
          active={active}
          onClick={() => {
            setActive(!active);
          }}
          className={clsx(styles.L0Title, active && styles.L0TitleExpanded)}
          id={`chkbox-${tagType}`}
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
              transparent
              value={filterSearchText}
              onChange={(e) => {
                setFilterSearchText(e.target.value);
              }}
            >
              <input />
              <Button
                basic
                icon
                size="small"
                className={styles.CloseBtn}
                onClick={() => {
                  setFilterSearchText("");
                }}
              >
                <Icon name="close" />
              </Button>
            </Input>
          )}
          {(filterSearchText.length > 0
            ? filterCategories(data, filterSearchText)
            : data
          ).categories.map((category: any) => (
            <>
              {Object.keys(category).map((l1: any) => (
                <List key={l1} className={styles.ListContainer}>
                  <List.Item
                    className={clsx(
                      styles.ListItem,
                      isCheckboxActive(
                        {
                          level: "l1",
                          type: tagType,
                          value: {
                            tagText: l1,
                          },
                        },
                        {
                          level: "l0",
                          type: tagType,
                          value: {
                            tagText: title,
                          },
                        }
                      ) && styles.ItemSelected
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
                          checked={isCheckboxActive(
                            {
                              level: "l1",
                              type: tagType,
                              value: {
                                tagText: l1,
                              },
                            },
                            {
                              level: "l0",
                              type: tagType,
                              value: {
                                tagText: title,
                              },
                            }
                          )}
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
                              isCheckboxActive(
                                {
                                  level: "l2",
                                  type: tagType,
                                  value: {
                                    tagText: l2,
                                  },
                                },
                                {
                                  level: "l1",
                                  type: tagType,
                                  value: {
                                    tagText: l1,
                                  },
                                },
                                {
                                  level: "l0",
                                  type: tagType,
                                  value: {
                                    tagText: title,
                                  },
                                }
                              ) && styles.ItemSelected
                            )}
                          >
                            <List.Content>
                              <List.Header
                                className={clsx(
                                  styles.Selector,
                                  styles.FilterSelect
                                )}
                                onClick={() => {
                                  handleL2Click(
                                    {
                                      level: "l2",
                                      type: tagType,
                                      value: {
                                        tagText: l2,
                                      },
                                    },
                                    {
                                      level: "l1",
                                      type: tagType,
                                      value: {
                                        tagText: l1,
                                      },
                                    }
                                  );
                                }}
                              >
                                <Checkbox
                                  label={l2}
                                  checked={isCheckboxActive(
                                    {
                                      level: "l2",
                                      type: tagType,
                                      value: {
                                        tagText: l2,
                                      },
                                    },
                                    {
                                      level: "l1",
                                      type: tagType,
                                      value: {
                                        tagText: l1,
                                      },
                                    },
                                    {
                                      level: "l0",
                                      type: tagType,
                                      value: {
                                        tagText: title,
                                      },
                                    }
                                  )}
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
  const [filterText, setFilterText] = useState("");

  const handleCheckboxClick = (topper: Topper) => {
    if (searchParamsClass.topperSelected(topper)) {
      searchParamsClass.setSearchParams({
        topper: undefined,
      });
    } else {
      searchParamsClass.setSearchParams({ topper });
    }
    searchParamsClass.searchForDocuments();
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
    <Accordion id="topper-scroll">
      <Accordion.Title
        id="topper-filter-title"
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
          <div id="topper-search-input">
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
          </div>
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
                    checked={searchParamsClass.topperSelected(topper)}
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
      </Accordion.Content>
    </Accordion>
  );
});

const OptionalsAccodion: FC<FilterAccordionProps> = observer(
  ({ title, data, tagType, handleCheckboxClick, iconSrc }) => {
    const [active, setActive] = useState(false);
    const searchParamsClass = React.useContext(SearchParamsContext);
    const [filterSearchText, setFilterSearchText] = useState<string>("");

    const isCheckboxActive = (tag: Tag, parent1Tag?: Tag, parent2Tag?: Tag) => {
      return (
        searchParamsClass.tagExists(tag) ||
        (parent1Tag ? searchParamsClass.tagExists(parent1Tag) : false) ||
        (parent2Tag ? searchParamsClass.tagExists(parent2Tag) : false)
      );
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
                level: "l1",
                type: tagType,
                value: {
                  tagText: l2,
                },
                optionalsId: mapOptionalToNumber[l1],
              };
              if (selected) {
                if (searchParamsClass.tagExists(l2Tag)) {
                  searchParamsClass.removeSubjectTag(l2Tag);
                }
              }
            });
          }
        });
      });

      searchParamsClass.searchForDocuments();
    };

    const handleL2Click = (tag: Tag, l1Tag?: Tag) => {
      if (l1Tag) {
        const l1Selected = searchParamsClass.tagExists(l1Tag);

        if (l1Selected) {
          searchParamsClass.removeSubjectTag(l1Tag);
        }
      }

      handleCheckboxClick(tag);
      searchParamsClass.searchForDocuments();
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
          {iconSrc && <img src={iconSrc} />}
          <div>{title}</div>
          {data.categories.length > 0 && <Icon size="large" name="dropdown" />}
        </Accordion.Title>
        <Accordion.Content active={active} className={styles.Section}>
          {data.categories.length > 0 && (
            <Input
              fluid
              size="small"
              className={styles.Input}
              placeholder="Search for topic"
              transparent
              value={filterSearchText}
              onChange={(e) => {
                setFilterSearchText(e.target.value);
              }}
            >
              <input />
              <Button
                basic
                icon
                size="small"
                className={styles.CloseBtn}
                onClick={() => {
                  setFilterSearchText("");
                }}
              >
                <Icon name="close" />
              </Button>
            </Input>
          )}
          {(filterSearchText.length > 0
            ? filterCategories(data, filterSearchText)
            : data
          ).categories.map((category: any) => (
            <>
              {Object.keys(category).map((l1: any) => (
                <List key={l1} className={styles.ListContainer}>
                  <List.Item
                    className={clsx(
                      styles.ListItem,
                      isCheckboxActive({
                        level: "l0",
                        type: tagType,
                        value: {
                          tagText: l1,
                        },
                        optionalsId: mapOptionalToNumber[l1],
                      }) && styles.ItemSelected
                    )}
                  >
                    <List.Content>
                      <List.Header
                        className={clsx(styles.SectionTitle)}
                        onClick={() => {
                          handleL1Click({
                            level: "l0",
                            type: tagType,
                            value: {
                              tagText: l1,
                            },
                            optionalsId: mapOptionalToNumber[l1],
                          });
                        }}
                      >
                        <Checkbox
                          label={l1}
                          checked={isCheckboxActive({
                            level: "l0",
                            type: tagType,
                            value: {
                              tagText: l1,
                            },
                            optionalsId: mapOptionalToNumber[l1],
                          })}
                        />
                      </List.Header>
                    </List.Content>
                  </List.Item>
                  {/* <List.Item
                    style={{
                      padding: 0,
                    }}
                  >
                    <List.Content>
                      <List.List className={styles.SubList}>
                        {Object.keys(category[l1]).map((l2: string) => (
                          <List.Item
                            key={l2}
                            className={clsx(
                              styles.ListItem,
                              isCheckboxActive(
                                {
                                  level: "l1",
                                  type: tagType,
                                  value: {
                                    tagText: l2,
                                  },
                                  optionalsId: mapOptionalToNumber[l1],
                                },
                                {
                                  level: "l0",
                                  type: tagType,
                                  value: {
                                    tagText: l1,
                                  },
                                  optionalsId: mapOptionalToNumber[l1],
                                }
                              ) && styles.ItemSelected
                            )}
                          >
                            <List.Content>
                              <List.Header
                                className={clsx(
                                  styles.Selector,
                                  styles.FilterSelect
                                )}
                                onClick={() => {
                                  handleL2Click(
                                    {
                                      level: "l1",
                                      type: tagType,
                                      value: {
                                        tagText: l2,
                                      },
                                      optionalsId: mapOptionalToNumber[l1],
                                    },
                                    {
                                      level: "l0",
                                      type: tagType,
                                      value: {
                                        tagText: l1,
                                      },
                                      optionalsId: mapOptionalToNumber[l1],
                                    }
                                  );
                                }}
                              >
                                <Checkbox
                                  label={l2}
                                  checked={isCheckboxActive(
                                    {
                                      level: "l1",
                                      type: tagType,
                                      value: {
                                        tagText: l2,
                                      },
                                      optionalsId: mapOptionalToNumber[l1],
                                    },
                                    {
                                      level: "l0",
                                      type: tagType,
                                      value: {
                                        tagText: l1,
                                      },
                                      optionalsId: mapOptionalToNumber[l1],
                                    }
                                  )}
                                />
                              </List.Header>
                            </List.Content>
                          </List.Item>
                        ))}
                      </List.List>
                    </List.Content>
                  </List.Item> */}
                </List>
              ))}
            </>
          ))}
        </Accordion.Content>
      </Accordion>
    );
  }
);

const FilterSection: FC = () => {
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
          data={gs4Categories}
          handleCheckboxClick={handleCheckboxClick}
          tagType="GS4"
        />
        <FilterAccordion
          title="Essay"
          data={{ categories: [] }}
          handleCheckboxClick={handleCheckboxClick}
          tagType="Essay"
        />
        <OptionalsAccodion
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
