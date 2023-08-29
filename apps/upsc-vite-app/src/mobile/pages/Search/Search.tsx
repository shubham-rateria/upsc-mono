// import { Dropdown } from "semantic-ui-react";
import MTopBarLayout from "../TopnavbarLayout";
import styles from "./Search.module.css";
// import { EmptyPagePlaceholder } from "../../../components/EmptyPagePlaceholder/EmptyPagePlaceholder";
import TagButton from "../../components/TagButton/TagButton";
import { useContext, useState } from "react";
import TopperDrawer from "../../components/TopperDrawer/TopperDrawer";
import { SearchParamsContext } from "../../../contexts/SearchParamsContext";
import SearchDrawer from "../../components/SearchDrawer/SearchDrawer";
import DocumentResult from "../../components/DocumentResult/DocumentResult";
import { observer } from "mobx-react-lite";
import DocTypeDrawer from "../../components/DocTypeDrawer/DocTypeDrawer";

const Search = () => {
  const [openToppersDrawer, setOpenToppersDrawer] = useState(false);
  const [openSearchDrawer, setOpenSearchDrawer] = useState(false);
  const [openDocTypeDrawer, setOpenDocTypeDrawer] = useState(false);
  const searchParamsClass = useContext(SearchParamsContext);

  const getTextForFakeInput = () => {
    let text = "Search for subject, keywords";
    if ((searchParamsClass.searchParams.keyword || "").length > 0) {
      text = searchParamsClass.searchParams.keyword || "";
    }
    if ((searchParamsClass.searchParams.subjectTags ?? []).length > 0) {
      // @ts-ignore
      text = searchParamsClass.searchParams.subjectTags[0].value.tagText;
    }
    if (
      (searchParamsClass.searchParams.keyword || "").length > 0 &&
      (searchParamsClass.searchParams.subjectTags ?? []).length > 0
    ) {
      // @ts-ignore
      text = `${searchParamsClass.searchParams.keyword} in ${searchParamsClass.searchParams.subjectTags[0].value.tagText}`;
    }
    return text;
  };

  const getDocTypeText = () => {
    switch (searchParamsClass.searchParams.documentType) {
      case -1:
        return "Doc Type";
      case 0:
        return "Notes";
      case 1:
        return "Sample Answers";
      default:
        return "Doc Type";
    }
  };

  return (
    <MTopBarLayout>
      <div className={styles.SearchInputContainer}>
        <div
          className={styles.FakeInput}
          onClick={() => {
            setOpenSearchDrawer(true);
          }}
        >
          {getTextForFakeInput()}
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
        <TagButton
          hasValue={false}
          text=""
          placeholder={getDocTypeText()}
          onClick={() => {
            setOpenDocTypeDrawer(true);
          }}
        />
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
      <DocTypeDrawer
        isOpen={openDocTypeDrawer}
        onClose={() => {
          setOpenDocTypeDrawer(false);
        }}
      />
    </MTopBarLayout>
  );
};

export default observer(Search);
