import React, { FC, useState } from "react";
import { debounce } from "lodash";
import styles from "./SearchBar.module.css";
import { Button } from "semantic-ui-react";

type Props = {
  onSearch: (searchText: string) => Promise<void>;
};

/**
 * The search bar should return the complete parameters for keyword search
 * @param param0
 * @returns
 */
const SearchBar: FC<Props> = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const debouncedSearch = debounce(() => {
    onSearch(searchText);
  }, 1000);

  /**
   *
   * @param event change event
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    // debouncedSearch();
  };

  const handleSearch = async () => {
    setLoading(true);
    await onSearch(searchText);
    setLoading(false);
  };

  return (
    <div>
      <input
        type="text"
        value={searchText}
        onChange={handleChange}
        className={styles.Input}
      />
      <Button
        onClick={handleSearch}
        className={styles.Button}
        loading={loading}
      >
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
