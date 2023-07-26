import React, { FC, useMemo, useState } from "react";
import gs1Categories from "../../data/gs1-categories";
import gs2Categories from "../../data/gs2-categories";
import { convertToCategoryType } from "@/utils/convert-json-to-category-type";
import { Accordion, Icon } from "semantic-ui-react";
import styles from "./FilterSection.module.css";
import { Tag, TagType } from "@/types";
import clsx from "clsx";

type Props = {
  onFilter: (filterOption: Tag) => void;
};

const FilterSection: FC<Props> = ({ onFilter }) => {
  const [filterOption, setFilterOption] = useState("");
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
    <div>
      <label>Filter by:</label>
      <div className={styles.FilterSection}>
        <h4 className={styles.FilterSectionHeader}>GS1</h4>
        {gs1Categories.categories.map((category, index) => (
          <div key={index}>
            {Object.keys(category).map((l1: any) => (
              <div key={l1} className={styles.Section}>
                <div
                  className={clsx(styles.SectionTitle, styles.FilterSelect)}
                  onClick={() => {
                    handleL1Click(l1, "GS1");
                  }}
                >
                  {l1}
                </div>
                <div>
                  {/* @ts-ignore */}
                  {Object.keys(category[l1]).map((l2: string) => (
                    <div
                      key={l2}
                      className={clsx(styles.Selector, styles.FilterSelect)}
                      onClick={() => {
                        handleL2Click(l2, "GS1");
                      }}
                    >
                      {l2}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.FilterSection}>
        <h4 className={styles.FilterSectionHeader}>GS2</h4>
        {gs2Categories.categories.map((category, index) => (
          <div key={index}>
            {Object.keys(category).map((l1: any) => (
              <div key={l1} className={styles.Section}>
                <div
                  className={clsx(styles.SectionTitle, styles.FilterSelect)}
                  onClick={() => {
                    handleL1Click(l1, "GS2");
                  }}
                >
                  {l1}
                </div>
                <div>
                  {/* @ts-ignore */}
                  {Object.keys(category[l1]).map((l2: string) => (
                    <div
                      key={l2}
                      className={clsx(styles.Selector, styles.FilterSelect)}
                      onClick={() => {
                        handleL2Click(l2, "GS2");
                      }}
                    >
                      {l2}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSection;
