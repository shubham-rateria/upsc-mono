// import { Dropdown } from "semantic-ui-react";
import MTopBarLayout from "../TopnavbarLayout";
import styles from "./Search.module.css";
// import { EmptyPagePlaceholder } from "../../../components/EmptyPagePlaceholder/EmptyPagePlaceholder";
import TagButton from "../../components/TagButton/TagButton";
import { useContext, useState } from "react";
import TopperDrawer from "../../components/TopperDrawer/TopperDrawer";
import { SearchParamsContext } from "../../../contexts/SearchParamsContext";
import SearchDrawer from "../../components/SearchDrawer/SearchDrawer";
import { observer } from "mobx-react-lite";
import DocTypeDrawer from "../../components/DocTypeDrawer/DocTypeDrawer";
import { InView } from "react-intersection-observer";
import { Loader } from "semantic-ui-react";
import ResultsSection from "../../components/ResultsSection/ResultsSection";

const tagTypeToText: any = {
  GS1: "General Studies I",
  GS2: "General Studies II",
  GS3: "General Studies III",
  GS4: "General Studies IV",
};

const convertTagTypeToText = (type: any, text: any) => {
  if (["GS1", "GS2", "GS3", "GS4"].includes(type)) {
    return tagTypeToText[type];
  }
  return text;
};

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
      const l0Tags =
        searchParamsClass.searchParams.subjectTags?.filter(
          (tag) => tag.level === "l0"
        ) ?? [];
      const otherTags =
        searchParamsClass.searchParams.subjectTags?.filter(
          (tag) => tag.level !== "l0"
        ) ?? [];
      console.log({ l0Tags, otherTags });
      if (otherTags.length > 0) {
        text = `${otherTags[0].value.tagText} in ${convertTagTypeToText(
          otherTags[0].type,
          otherTags[0].value.tagText
        )}`;
      } else if (l0Tags.length > 0) {
        text = l0Tags[0].value.tagText;
      }
    }
    if (
      (searchParamsClass.searchParams.keyword || "").length > 0 &&
      (searchParamsClass.searchParams.subjectTags ?? []).length > 0
    ) {
      // @ts-ignore
      text = `${
        searchParamsClass.searchParams.keyword
      } in ${convertTagTypeToText(
        // @ts-ignore
        searchParamsClass.searchParams.subjectTags[0].type,
        // @ts-ignore
        searchParamsClass.searchParams.subjectTags[0].value.tagText
      )}`;
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

  const getResultsText = () => {
    if ((searchParamsClass.lastSearchParams.keyword || "").length > 0) {
      return (
        <div>
          {`Showing first ${
            searchParamsClass.docSearchResults?.length ?? -1
          } documents containing`}{" "}
          <span className={styles.Keyword}>
            "{searchParamsClass.lastSearchParams.keyword}"
          </span>
        </div>
      );
    } else {
      return (
        <div>
          {`Showing ${
            searchParamsClass.docSearchResults?.length ?? -1
          } documents out of many`}
        </div>
      );
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
      <div className={styles.ResultText}>
        {(searchParamsClass.docSearchResults?.length ?? -1) > 0 &&
          !searchParamsClass.searching && (
            <div className={styles.DocFound}>{getResultsText()}</div>
          )}
      </div>
      <div className={styles.Divider} />
      <div className={styles.ResultSection}>
        <ResultsSection />
        {searchParamsClass.docSearchResults &&
          searchParamsClass.docSearchResults?.length > 0 && (
            <InView
              key={searchParamsClass.pageNumber}
              as="div"
              threshold={1}
              onChange={(inView) => {
                if (inView) {
                  searchParamsClass.getNext();
                }
              }}
            >
              <div />
              {searchParamsClass.searchingNextResults && (
                <div className={styles.PaginateLoader}>
                  <Loader
                    className={styles.Loader}
                    active
                    inline
                    size="small"
                  />
                  <span>Loading...</span>
                </div>
              )}
            </InView>
          )}
      </div>
      <TopperDrawer
        isOpen={openToppersDrawer}
        onClose={() => {
          setOpenToppersDrawer(false);
        }}
      />
      {openSearchDrawer && (
        <SearchDrawer
          isOpen={openSearchDrawer}
          onClose={() => {
            setOpenSearchDrawer(false);
          }}
        />
      )}
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
