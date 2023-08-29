import { Dropdown } from "semantic-ui-react";
import MTopBarLayout from "../TopnavbarLayout";
import styles from "./Search.module.css";
import { EmptyPagePlaceholder } from "../../../components/EmptyPagePlaceholder/EmptyPagePlaceholder";
import TagButton from "../../components/TagButton/TagButton";
import { useContext, useState } from "react";
import TopperDrawer from "../../components/TopperDrawer/TopperDrawer";
import { SearchParamsContext } from "../../../contexts/SearchParamsContext";
import SearchDrawer from "../../components/SearchDrawer/SearchDrawer";
import DocumentResult from "../../components/DocumentResult/DocumentResult";
import { observer } from "mobx-react-lite";

const Search = () => {
  const [openToppersDrawer, setOpenToppersDrawer] = useState(false);
  const [openSearchDrawer, setOpenSearchDrawer] = useState(false);
  const searchParamsClass = useContext(SearchParamsContext);

  return (
    <MTopBarLayout>
      <div className={styles.SearchInputContainer}>
        <div
          className={styles.FakeInput}
          onClick={() => {
            setOpenSearchDrawer(true);
          }}
        >
          Search for subject, keywords
        </div>
      </div>
      <div className={styles.TagButtons}>
        <TagButton
          iconPath="/icons/do-ribbon.svg"
          hasValue={searchParamsClass.searchParams.topper ? true : false}
          text={searchParamsClass.searchParams.topper?.name || ""}
          placeholder="Select Topper"
          onClick={() => {
            setOpenToppersDrawer(true);
          }}
        />
        <TagButton hasValue={false} text="" placeholder="Doc Type" />
        <TagButton hasValue={false} text="" placeholder="From Year" />
        <TagButton hasValue={false} text="" placeholder="Search In" />
      </div>
      {/* <div className={styles.EmptyContainer}>
        <EmptyPagePlaceholder
          imgSrc="/img/decide.svg"
          title="Start a new search"
          description="Use the filters or enter any keyword to perform a search"
        ></EmptyPagePlaceholder>
      </div> */}
      <div className={styles.ResultSection}>
        {searchParamsClass.docSearchResults &&
          searchParamsClass.docSearchResults.length > 0 &&
          searchParamsClass.docSearchResults?.map((result, index) => (
            <DocumentResult result={result} key={index} />
          ))}
      </div>
      <TopperDrawer
        isOpen={openToppersDrawer}
        onClose={() => {
          setOpenToppersDrawer(false);
        }}
      />
      <SearchDrawer
        isOpen={openSearchDrawer}
        onClose={() => {
          setOpenSearchDrawer(false);
        }}
      />
    </MTopBarLayout>
  );
};

export default observer(Search);
