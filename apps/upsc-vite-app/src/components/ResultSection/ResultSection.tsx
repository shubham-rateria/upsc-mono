import { SearchParamsContext } from "../../contexts/SearchParamsContext";
import React, { FC } from "react";

import DocumentResult from "../DocumentResult/DocumentResult";
import { observer } from "mobx-react-lite";
import DocSearchPlaceholder from "../DocSearchPlaceholder/DocSearchPlaceholder";
import { EmptyPagePlaceholder } from "../EmptyPagePlaceholder/EmptyPagePlaceholder";

const ResultSection: FC = () => {
  const searchParamsClass = React.useContext(SearchParamsContext);

  return (
    <div>
      {!searchParamsClass.searching &&
        searchParamsClass.docSearchResults?.length === 0 && (
          <EmptyPagePlaceholder
            imgSrc="/img/start-results.svg"
            title="No Search Results"
            description="Use the filters or enter any keyword to perform a search"
          />
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
