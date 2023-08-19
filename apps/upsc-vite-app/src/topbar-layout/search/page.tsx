import { useContext } from "react";
import styles from "./SearchPage.module.css"; // Import the CSS module
import SearchBar from "../../components/SearchBar/SearchBar";
import ResultSection from "../../components/ResultSection/ResultSection";
import FilterSection from "../../components/FilterSection/FilterSection";
import {
  Button,
  Checkbox,
  Dropdown,
  Icon,
  Label,
  Loader,
} from "semantic-ui-react";
import { DocumentType, Tag } from "usn-common";
import { SearchParamsContext } from "../../contexts/SearchParamsContext";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import globalStyles from "../../styles/global.module.css";
import { InView } from "react-intersection-observer";

const SearchPage = observer(() => {
  const searchParamsClass = useContext(SearchParamsContext);

  const handleDocumentTypeChange = (documentType: DocumentType) => {
    searchParamsClass.setSearchParams({
      documentType,
    });
    searchParamsClass.searchForDocuments();
  };

  const handleYearChange = (year: number) => {
    searchParamsClass.setSearchParams({
      year,
    });
  };

  const handleFavouritesChange = (favourites: boolean) => {
    searchParamsClass.setSearchParams({
      favourites,
    });
  };

  const handleClearTag = (tag: Tag) => {
    searchParamsClass.removeSubjectTag(tag);
    searchParamsClass.searchForDocuments();
  };

  const handleClearTopper = () => {
    searchParamsClass.setSearchParams({ topper: undefined });
    searchParamsClass.searchForDocuments();
  };

  return (
    <div>
      <div className={styles.SearchPage}>
        <div className={styles.filterSection}>
          <h2 className={styles.Header}>
            <img src="/icons/do-filter-circle.svg" />
            <div>Filters</div>
          </h2>
          <FilterSection />
        </div>
        <div className={styles.mainContent}>
          <div className={styles.topSection}>
            <div className={styles.flashText}>
              <div className={styles.Img}>
                <svg
                  width="18"
                  height="24"
                  viewBox="0 0 18 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.53367 22.264L5.52992 22.2855C5.51453 22.3733 5.51854 22.4634 5.54171 22.5495L5.53367 22.264ZM5.53367 22.264V22.2598M5.53367 22.264V22.2598M5.53367 22.2598L6.84729 15.0463L6.90097 14.7515H6.60133H1.49992C1.40559 14.7515 1.31316 14.7248 1.2333 14.6745C1.1534 14.6241 1.08944 14.5521 1.04878 14.4669C1.0081 14.3817 0.992392 14.2868 1.00343 14.1931L1.00344 14.193C1.01448 14.0993 1.05182 14.0106 1.11116 13.9372C1.11117 13.9372 1.11118 13.9372 1.11119 13.9372L11.3848 1.23689L11.3848 1.2369L11.3868 1.23433C11.4699 1.12885 11.5853 1.05344 11.7154 1.0197C11.8454 0.985969 11.9829 0.995745 12.1069 1.04757C12.2308 1.09937 12.3343 1.19033 12.4018 1.30656L5.53367 22.2598ZM12.4779 1.708V1.7067L12.4798 1.69122C12.4965 1.558 12.4691 1.42292 12.4018 1.30666L12.4779 1.708ZM12.4779 1.708C12.4773 1.7113 12.4764 1.71584 12.4755 1.72092M12.4779 1.708L12.4755 1.72092M12.4755 1.72092L11.1536 8.9566L11.0997 9.25153H11.3995H16.4999C16.4999 9.25153 16.4999 9.25153 16.4999 9.25153C16.5943 9.25155 16.6868 9.27828 16.7666 9.32866C16.8465 9.37907 16.9105 9.45103 16.9511 9.53614C16.9918 9.62136 17.0075 9.7163 16.9964 9.80999C16.9853 9.90382 16.948 9.99252 16.8887 10.0658L16.8886 10.0659L6.6137 22.7662L6.61368 22.7661L6.61203 22.7682C6.55461 22.8408 6.48159 22.8994 6.39841 22.9398C6.31518 22.9802 6.22395 23.0013 6.13154 23.0015C6.04248 23.0015 5.95451 22.9821 5.87379 22.9445C5.79296 22.9069 5.72134 22.8521 5.66399 22.7838C5.6066 22.7156 5.56487 22.6356 5.54172 22.5496L12.4755 1.72092Z"
                    fill="#7963FF"
                    stroke="#7963FF"
                    stroke-width="0.5"
                    className="svg-elem-1"
                  ></path>
                </svg>
              </div>
              <div className={styles.Text}>
                Get notes from repository of over 4000 documents...
              </div>
            </div>
            <div className={styles.searchBarContainer}>
              <SearchBar />
            </div>
            <div className={styles.subjectLabels}>
              <div>
                {searchParamsClass.searchParams.subjectTags?.map(
                  (tag: Tag, index: number) => (
                    <Label key={index} className={globalStyles.LabelPrimary}>
                      {tag.value.tagText}{" "}
                      <Icon
                        name="close"
                        onClick={() => {
                          handleClearTag(tag);
                        }}
                      />
                    </Label>
                  )
                )}
              </div>
              {searchParamsClass.searchParams.topper && (
                <div className={styles.TopperTag}>
                  Topper{" "}
                  <Label className={globalStyles.LabelPrimary}>
                    {searchParamsClass.searchParams.topper.name}
                    <Icon
                      name="close"
                      onClick={() => {
                        handleClearTopper();
                      }}
                    />
                  </Label>
                </div>
              )}
            </div>
            <div className={styles.SelectorSection}>
              {(searchParamsClass.docSearchResults?.length ?? -1) > 0 &&
                !searchParamsClass.searching && (
                  <div className={styles.DocFound}>
                    {`${
                      searchParamsClass.docSearchResults?.length ?? -1
                    } documents found`}
                  </div>
                )}
              <div className={styles.Action}>
                <div className={styles.Item}>
                  <div className={styles.ItemHeader}>Year</div>
                  <div>
                    <Dropdown
                      text={
                        searchParamsClass.searchParams.year !== -1
                          ? `${searchParamsClass.searchParams.year} Onwards`
                          : "All Years"
                      }
                      floating
                      labeled
                      button
                      item
                      direction="left"
                      className={styles.Dropdown}
                    >
                      <Dropdown.Menu className={styles.Dropdown}>
                        <Dropdown.Item
                          onClick={() => {
                            handleYearChange(-1);
                          }}
                        >
                          <Checkbox
                            label="All"
                            radio
                            onMouseDown={() => {
                              handleYearChange(-1);
                            }}
                            checked={searchParamsClass.searchParams.year === -1}
                          />
                        </Dropdown.Item>
                        <Dropdown.Header
                          content="Onwards"
                          className={styles.Title}
                        />
                        {[2022, 2021, 2020, 2019, 2018].map((year: number) => (
                          <Dropdown.Item
                            key={year}
                            onClick={() => {
                              handleYearChange(year);
                            }}
                          >
                            <Checkbox
                              label={year}
                              radio
                              value={year}
                              id={year}
                              name="year"
                              checked={
                                searchParamsClass.searchParams.year === year
                              }
                              onMouseDown={() => {
                                handleYearChange(year);
                              }}
                            />
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>

                <div className={styles.Item}>
                  <div className={styles.ItemHeader}>Show From</div>
                  <div>
                    <Dropdown
                      text={
                        searchParamsClass.searchParams.favourites
                          ? "Favourites"
                          : "All"
                      }
                      floating
                      labeled
                      button
                      direction="left"
                      className={styles.Dropdown}
                    >
                      <Dropdown.Menu className={styles.Dropdown}>
                        <Dropdown.Item
                          onClick={() => {
                            handleFavouritesChange(false);
                          }}
                        >
                          <Checkbox
                            label="All"
                            radio
                            checked={!searchParamsClass.searchParams.favourites}
                            onMouseDown={() => {
                              handleFavouritesChange(false);
                            }}
                          />
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => {
                            handleFavouritesChange(true);
                          }}
                        >
                          <Checkbox
                            label="Favourites"
                            radio
                            value={"Favourites"}
                            id={"Favourites"}
                            name="favourites"
                            checked={searchParamsClass.searchParams.favourites}
                            onMouseDown={() => {
                              handleFavouritesChange(true);
                            }}
                          />
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
                <div className={styles.Item}>
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
                    >
                      Sample Answers
                    </Button>
                  </Button.Group>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.resultSection} id="results-section">
            <ResultSection />
            {searchParamsClass.docSearchResults &&
              searchParamsClass.docSearchResults?.length > 0 && (
                <InView
                  key={searchParamsClass.pageNumber}
                  as="div"
                  threshold={1}
                  onChange={(inView) => {
                    if (inView) {
                      searchParamsClass.getNext();
                    }
                  }}
                >
                  <div />
                  {searchParamsClass.searchingNextResults && (
                    <div className={styles.PaginateLoader}>
                      <Loader
                        className={styles.Loader}
                        active
                        inline
                        size="small"
                      />
                      <span>Loading...</span>
                    </div>
                  )}
                </InView>
              )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default SearchPage;
