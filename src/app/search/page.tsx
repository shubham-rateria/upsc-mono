"use client";

import React, { useState } from "react";
import styles from "./SearchPage.module.css"; // Import the CSS module
import SearchBar from "@/components/SearchBar/SearchBar";
import ResultSection from "@/components/ResultSection/ResultSection";
import FilterSection from "@/components/FilterSection/FilterSection";
import TopNavBar from "@/components/TopNavbar/TopNavBar";
import { Form, Icon, Label, Radio } from "semantic-ui-react";
import axios from "axios";
import { Result, Tag } from "@/types";
import {
  searchParamsClass,
  SearchParamsContext,
} from "@/contexts/SearchParamsContext";
import "semantic-ui-css/semantic.min.css";
import {observer} from 'mobx-react-lite';

const SearchPage = () => {
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState<Tag | null>();
  const [documentType, setDocumentType] = useState(-1);
  const [results, setResults] = useState<Result[]>([]);

  const handleSearch = async (searchText: string) => {
    setSearchText(searchText);
    // Implement the logic to fetch search results based on searchText and filterOption
    // For demonstration purposes, I'm setting dummy results here:
    try {
      const response = await axios.post("/api/documents", {
        search: searchText,
        pageNumber: 1,
        documentType: documentType === -1 ? null : documentType,
        tagType: searchParamsClass.searchParams.tag,
      });
      setResults(response.data?.data || []);
    } catch (error) {}
  };

  const handleFilter = (filterOption: Tag) => {
    setFilterOption(filterOption);
  };

  const handleRadioChange = (e: any, { value }: any) => {
    setDocumentType(value);
  };

  const handleClearTag = () => {
    searchParamsClass.setSearchParams({
      tag: null
    })
  };

  return (
    <div className={styles.Container}>
      <SearchParamsContext.Provider value={searchParamsClass}>
        <div className={styles.TopNavContainer}>
          <TopNavBar />
        </div>
        <div className={styles.SearchPage}>
          <div className={styles.filterSection}>
            <h1 className={styles.Header}>Filter</h1>
            <FilterSection />
          </div>
          <div className={styles.mainContent}>
            <h1>Document Page</h1>
            <div className={styles.searchBarContainer}>
              <SearchBar onSearch={handleSearch} />
            </div>
            <div>
              <Form>
                <Form.Group inline>
                  <Form.Field>
                    <Radio
                      label="All"
                      name="radioGroup"
                      value={-1}
                      checked={documentType === -1}
                      onChange={handleRadioChange}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Radio
                      label="Notes"
                      name="radioGroup"
                      value={0}
                      checked={documentType === 0}
                      onChange={handleRadioChange}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Radio
                      label="Mock Tests"
                      name="radioGroup"
                      value={1}
                      checked={documentType === 1}
                      onChange={handleRadioChange}
                    />
                  </Form.Field>
                </Form.Group>
              </Form>
            </div>
            <div
              style={{
                marginBottom: "1rem",
              }}
            >
              {searchParamsClass.searchParams.tag && (
                <Label>
                  {searchParamsClass.searchParams.tag.value.tagText}
                  <Icon name="delete" onClick={handleClearTag} />
                </Label>
              )}
            </div>
            <div className={styles.resultSection}>
              <ResultSection results={results} />
            </div>
          </div>
        </div>
      </SearchParamsContext.Provider>
    </div>
  );
};

export default observer(SearchPage);
