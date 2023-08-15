import React, { FC } from "react";
import styles from "./SearchBar.module.css";
import { Button, Input } from "semantic-ui-react";
import { SearchParamsContext } from "../../contexts/SearchParamsContext";
import { observer } from "mobx-react-lite";

/**
 * The search bar should return the complete parameters for keyword search
 * @param param0
 * @returns
 */
const SearchBar: FC = () => {
  const searchParamsClass = React.useContext(SearchParamsContext);

  /**
   *
   * @param event change event
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    searchParamsClass.setSearchParams({ keyword: event.target.value });
    // debouncedSearch();
  };

  const handleSearch = () => {
    searchParamsClass.searchForDocuments();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles.Container}>
      <Input
        type="text"
        icon="search"
        iconPosition="left"
        placeholder="Search for specific topics, e.g. Indus Valley..."
        value={searchParamsClass.searchParams.keyword}
        onChange={handleChange}
        className={styles.Input}
        labelPosition="right"
        onKeyPress={handleKeyPress}
        label={
          <Button
            onClick={handleSearch}
            className={styles.Button}
            loading={searchParamsClass.searching}
          >
            Search
          </Button>
        }
      />
    </div>
  );
};

export default observer(SearchBar);
