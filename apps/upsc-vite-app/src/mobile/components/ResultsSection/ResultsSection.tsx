import { useContext } from "react";
import { SearchParamsContext } from "../../../contexts/SearchParamsContext";
import DocumentResult from "../DocumentResult/DocumentResult";
import { observer } from "mobx-react-lite";
import DocSearchPlaceholder from "../DocSearchPlaceholder/DocSearchPlaceholder";
import styles from "./ResultsSection.module.css";
import { EmptyPagePlaceholder } from "../../../components/EmptyPagePlaceholder/EmptyPagePlaceholder";

const ResultsSection = () => {
  const searchParamsClass = useContext(SearchParamsContext);

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
              description="Use the filters or enter any keyword to perform a search"
            ></EmptyPagePlaceholder>
          </div>
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
