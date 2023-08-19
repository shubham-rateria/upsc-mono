import { SearchParamsContext } from "../../contexts/SearchParamsContext";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";

import DocumentResult from "../DocumentResult/DocumentResult";
import { observer } from "mobx-react-lite";
import DocSearchPlaceholder from "../DocSearchPlaceholder/DocSearchPlaceholder";
import { EmptyPagePlaceholder } from "../EmptyPagePlaceholder/EmptyPagePlaceholder";
import { Button } from "semantic-ui-react";
import styles from "./ResultSection.module.css";

const ResultSection: FC = observer(() => {
  const searchParamsClass = React.useContext(SearchParamsContext);
  const loader = useRef(null);
  const [_, setLoading] = useState(false);

  const handleClear = () => {
    searchParamsClass.clearFilters();
  };

  const handleObserver = useCallback(async () => {
    console.log("triggering observer");

    if (searchParamsClass.defaultState() || searchParamsClass.searching) {
      return;
    }

    setLoading(true);
    await searchParamsClass.getNext();
    setLoading(false);
  }, []);

  useEffect(() => {
    const option = {
      root: document.getElementById("results-section"),
      rootMargin: "0px",
      threshold: 1,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, []);

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
    <div>
      {searchParamsClass.defaultState() &&
        searchParamsClass.docSearchResults?.length === 0 && (
          <EmptyPagePlaceholder
            imgSrc="/img/decide.svg"
            title="Start a new search"
            description="Use the filters or enter any keyword to perform a search"
          ></EmptyPagePlaceholder>
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
      <div>
        {searchParamsClass.docSearchResults &&
          searchParamsClass.docSearchResults.length > 0 &&
          searchParamsClass.docSearchResults?.map((result, index) => (
            <DocumentResult result={result} key={index} />
          ))}
      </div>
    </div>
  );
});

export default ResultSection;
