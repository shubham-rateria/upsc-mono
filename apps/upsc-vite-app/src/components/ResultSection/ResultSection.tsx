import { SearchParamsContext } from "../../contexts/SearchParamsContext";
import React, { FC } from "react";

import DocumentResult from "../DocumentResult/DocumentResult";
import { observer } from "mobx-react-lite";
import DocSearchPlaceholder from "../DocSearchPlaceholder/DocSearchPlaceholder";
import { EmptyPagePlaceholder } from "../EmptyPagePlaceholder/EmptyPagePlaceholder";
import { Button } from "semantic-ui-react";
import styles from "./ResultSection.module.css";

const ResultSection: FC = () => {
  const searchParamsClass = React.useContext(SearchParamsContext);

  const handleClear = () => {
    searchParamsClass.clearFilters();
  };

  return (
    <div>
      {searchParamsClass.defaultState() && (
        <EmptyPagePlaceholder
          imgSrc="/img/decide.svg"
          title="Start a new search"
          description="Use the filters or enter any keyword to perform a search"
        ></EmptyPagePlaceholder>
      )}
      {!searchParamsClass.searching &&
        !searchParamsClass.defaultState() &&
        searchParamsClass.docSearchResults?.length === 0 && (
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
      {!searchParamsClass.searching &&
        searchParamsClass.docSearchResults?.map((result, index) => (
          <DocumentResult result={result} key={index} />
        ))}
      {searchParamsClass.searching && (
        <div>
          <DocSearchPlaceholder />
          <DocSearchPlaceholder />
          <DocSearchPlaceholder />
          <DocSearchPlaceholder />
        </div>
      )}
    </div>
  );
};

export default observer(ResultSection);
