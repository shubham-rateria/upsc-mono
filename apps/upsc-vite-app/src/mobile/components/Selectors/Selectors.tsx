import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { Button, Dropdown, Input } from "semantic-ui-react";
import { Topper, DocumentType } from "usn-common";
import { searchParamsClass } from "../../../contexts/SearchParamsContext";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axios-instance";
import styles from "./Selectors.module.css";

const Selectors = observer(() => {
  const [toppers, setToppers] = useState<Topper[]>([]);
  const [_topperLoading, setTopperLoading] = useState(false);
  const [topperNameSearch, setTopperNameSearch] = useState("");
  const handleDocumentTypeChange = (documentType: DocumentType) => {
    searchParamsClass.setSearchParams({
      documentType,
    });
    searchParamsClass.searchForDocuments();
  };

  const handleSelectTopper = (topper: Topper) => {
    setTopperNameSearch("");
    searchParamsClass.setSearchParams({
      topper,
    });
    searchParamsClass.searchForDocuments();
  };

  const handleTopperNameInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTopperNameSearch(event.target.value);
  };

  const handleClearTopper = () => {
    searchParamsClass.setSearchParams({
      topper: undefined,
    });
    searchParamsClass.searchForDocuments();
  };

  const disableSelectors = () => {
    if (
      (searchParamsClass.searchParams.subjectTags || []).length === 0 &&
      (searchParamsClass.searchParams.keyword || "").length === 0
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    /**
     * get toppers
     */

    const init = async () => {
      setTopperLoading(true);
      const data: any = { tag: null };
      try {
        if ((searchParamsClass.searchParams.subjectTags || []).length > 0) {
          // @ts-ignore
          data.tag = searchParamsClass.searchParams.subjectTags[0];
        }
        const response = await axiosInstance.post("/api/toppers", data);
        setToppers(response.data.data);
      } catch (error) {
        console.error("Error in getting toppers", error);
      }
      setTopperLoading(false);
    };

    init();
  }, [searchParamsClass.searchParams.subjectTags]);

  return (
    <div className={styles.SelectorSection}>
      <div className={styles.Action}>
        <div className={styles.Right}>
          <div className={styles.Item} id="document-type-selector">
            <Button.Group className={styles.DocumentTypeSelector}>
              <Button
                className={clsx(
                  styles.Button,
                  searchParamsClass.searchParams.documentType === -1 &&
                    styles.ButtonActive
                )}
                onClick={() => {
                  handleDocumentTypeChange(-1);
                }}
                disabled={disableSelectors()}
              >
                All
              </Button>
              <Button
                className={clsx(
                  styles.Button,
                  searchParamsClass.searchParams.documentType === 0 &&
                    styles.ButtonActive
                )}
                onClick={() => {
                  handleDocumentTypeChange(0);
                }}
                disabled={disableSelectors()}
              >
                Notes
              </Button>
              <Button
                className={clsx(
                  styles.Button,
                  searchParamsClass.searchParams.documentType === 1 &&
                    styles.ButtonActive
                )}
                onClick={() => {
                  handleDocumentTypeChange(1);
                }}
                id="btn-sample-answers"
                disabled={disableSelectors()}
              >
                Sample Answers
              </Button>
            </Button.Group>
          </div>
          <div className={styles.Item}>
            <div className={styles.DropdownBtn}>
              <img src="/icons/do-ribbon.svg" />
              <Dropdown
                text={
                  searchParamsClass.searchParams.topper?.name ?? "Select Topper"
                }
                floating
                button
                labeled
                item
                direction="left"
                className={`${styles.Dropdown}`}
                disabled={disableSelectors()}
              >
                <Dropdown.Menu
                  className={styles.Dropdown}
                  style={{
                    maxHeight: "500px",
                    overflowY: "auto",
                  }}
                >
                  <Input
                    onClick={(e: any) => {
                      e.stopPropagation();
                    }}
                    onKeyDown={(e: any) => {
                      e.stopPropagation();
                    }}
                    className={styles.TopperInput}
                    onChange={handleTopperNameInput}
                    value={topperNameSearch}
                    placeholder="Search for topper"
                  />
                  {(topperNameSearch.length > 0
                    ? toppers.filter((t) =>
                        t.name?.toLowerCase().includes(topperNameSearch)
                      )
                    : toppers
                  ).map((topper: Topper) => (
                    <Dropdown.Item
                      key={topper.name}
                      onClick={() => {
                        handleSelectTopper(topper);
                      }}
                    >
                      <div className={styles.TopperItem}>
                        <input
                          name="year"
                          type="radio"
                          checked={searchParamsClass.topperSelected(topper)}
                        ></input>
                        <span className={styles.TopperName}>{topper.name}</span>
                        <span className={styles.TopperAttribs}>
                          Rank {topper.rank}
                        </span>
                        <span className={styles.TopperAttribs}>
                          Year {topper.year}
                        </span>
                      </div>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              {searchParamsClass.searchParams.topper && (
                <Button
                  icon="close"
                  circular
                  size="mini"
                  className={styles.TopperClearBtn}
                  onClick={handleClearTopper}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Selectors;
