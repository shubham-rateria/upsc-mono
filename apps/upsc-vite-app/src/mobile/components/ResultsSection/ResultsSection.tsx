import { useContext } from "react";
import { SearchParamsContext } from "../../../contexts/SearchParamsContext";
import DocumentResult from "../DocumentResult/DocumentResult";
import { observer } from "mobx-react-lite";
import DocSearchPlaceholder from "../DocSearchPlaceholder/DocSearchPlaceholder";
import styles from "./ResultsSection.module.css";
import { EmptyPagePlaceholder } from "../../../components/EmptyPagePlaceholder/EmptyPagePlaceholder";
import { Button } from "semantic-ui-react";

const ResultsSection = () => {
  const searchParamsClass = useContext(SearchParamsContext);

  const handleClear = () => {
    searchParamsClass.clearFilters();
  };

  if (searchParamsClass.searching) {
    return (
      <div>
        <DocSearchPlaceholder />
        <DocSearchPlaceholder />
        <DocSearchPlaceholder />
        <DocSearchPlaceholder />
      </div>
    );
  }

  return (
    <>
      {searchParamsClass.defaultState() &&
        searchParamsClass.docSearchResults?.length === 0 && (
          <div className={styles.EmptyContainer}>
            <EmptyPagePlaceholder
              imgSrc="/img/decide.svg"
              title="Start a new search"
              description="Start a new search by selecting subject or search for specific keywords"
            ></EmptyPagePlaceholder>
          </div>
        )}
      {!searchParamsClass.defaultState() &&
        searchParamsClass.docSearchResults &&
        searchParamsClass.docSearchResults.length === 0 && (
          <EmptyPagePlaceholder
            imgSrc="/img/start-results.svg"
            title="No Search Results"
            description="Use the filters or enter any keyword to perform a search"
          >
            <Button className={styles.RemoveBtn} onClick={handleClear}>
              Clear Filters
            </Button>
          </EmptyPagePlaceholder>
        )}
      {searchParamsClass.docSearchResults &&
        searchParamsClass.docSearchResults.length > 0 &&
        searchParamsClass.docSearchResults?.map((result, index) => (
          <DocumentResult result={result} key={index} />
        ))}
    </>
  );
};

export default observer(ResultsSection);
