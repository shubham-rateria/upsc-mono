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
const SearchBar: FC = observer(() => {
  const searchParamsClass = React.useContext(SearchParamsContext);

  /**
   *
   * @param event change event
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    searchParamsClass.setSearchParams({ keyword: event.target.value });
    // setInputText(event.target.value);
  };

  const handleSearch = () => {
    // searchParamsClass.setSearchParams({ keyword: inputText });
    searchParamsClass.searchForDocuments();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  // useEffect(() => {
  //   if (searchParamsClass.searchParams.keyword) {
  //     setInputText(searchParamsClass.searchParams.keyword);
  //   }
  // }, []);

  return (
    <div className={styles.Container}>
      <Input
        type="text"
        icon="search"
        iconPosition="left"
        placeholder="Search for specific topics, e.g. Indus Valley..."
        value={searchParamsClass.searchParams.keyword || ""}
        onChange={handleChange}
        className={styles.Input}
        id="search-input"
        labelPosition="right"
        onKeyPress={handleKeyPress}
        label={
          <Button
            onClick={handleSearch}
            className={styles.Button}
            loading={searchParamsClass.searching}
            disabled={!searchParamsClass.searchParams.keyword}
            id="search-btn"
          >
            Search
          </Button>
        }
      />
    </div>
  );
});

export default SearchBar;
