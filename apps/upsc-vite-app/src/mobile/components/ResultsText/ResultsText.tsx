import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { SearchParamsContext } from "../../../contexts/SearchParamsContext";
import { Tag } from "usn-common";
import styles from "./ResultsText.module.css";

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
  if (type === "Essay") {
    return "Essay";
  }
  return text;
};

const ResultsText = observer(() => {
  const searchParamsClass = useContext(SearchParamsContext);

  if (
    searchParamsClass.docSearchResults.length === 0 ||
    searchParamsClass.searching
  ) {
    return <></>;
  }

  const l0Topics = (searchParamsClass.searchParams.subjectTags ?? []).filter(
    (tag: Tag) => tag.level === "l0"
  );
  const l1Topics = (searchParamsClass.searchParams.subjectTags ?? []).filter(
    (tag: Tag) => tag.level === "l1"
  );
  const l2Topics = (searchParamsClass.searchParams.subjectTags ?? []).filter(
    (tag: Tag) => tag.level === "l2"
  );
  console.log({ tags: searchParamsClass.searchParams.subjectTags });
  if (
    l0Topics.length > 0 &&
    (searchParamsClass.searchParams.keyword ?? "").length === 0
  ) {
    return (
      <div className={styles.DocFound}>
        {`Showing ${
          searchParamsClass.docSearchResults?.length ?? -1
        } documents of`}{" "}
        <span className={styles.Keyword}>
          {convertTagTypeToText(l0Topics[0].type, l0Topics[0].value.tagText)}{" "}
        </span>
        out of many
      </div>
    );
  }
  if (
    l0Topics.length > 0 &&
    (searchParamsClass.searchParams.keyword ?? "").length > 0
  ) {
    return (
      <div className={styles.DocFound}>
        {`Showing first ${
          searchParamsClass.docSearchResults?.length ?? -1
        } documents of`}{" "}
        <span className={styles.Keyword}>
          {convertTagTypeToText(l0Topics[0].type, l0Topics[0].value.tagText)}{" "}
        </span>
        containing{" "}
        <span className={styles.Keyword}>
          "{searchParamsClass.searchParams.keyword}"{" "}
        </span>
      </div>
    );
  }
  if (l1Topics.length > 0) {
    return (
      <div className={styles.DocFound}>
        {`Showing ${
          searchParamsClass.docSearchResults?.length ?? -1
        } documents of`}{" "}
        <span className={styles.Keyword}>{l1Topics[0].value.tagText} </span>
        in{" "}
        <span className={styles.Keyword}>
          {l1Topics[0].optionalsName ??
            convertTagTypeToText(
              l1Topics[0].type,
              l1Topics[0].value.tagText
            )}{" "}
        </span>
        out of many
      </div>
    );
  }
  if (l2Topics.length > 0) {
    return (
      <div className={styles.DocFound}>
        {`Showing ${
          searchParamsClass.docSearchResults?.length ?? -1
        } documents of`}{" "}
        <span className={styles.Keyword}>{l2Topics[0].value.tagText} </span>
        in{" "}
        <span className={styles.Keyword}>
          {l2Topics[0].optionalsName ??
            convertTagTypeToText(
              l2Topics[0].type,
              l2Topics[0].value.tagText
            )}{" "}
        </span>
        out of many
      </div>
    );
  }
  if ((searchParamsClass.searchParams.keyword || "").length > 0) {
    return (
      <div className={styles.DocFound}>
        {`Showing first ${
          searchParamsClass.docSearchResults?.length ?? -1
        } documents`}{" "}
        containing{" "}
        <span className={styles.Keyword}>
          "{searchParamsClass.searchParams.keyword}"{" "}
        </span>
      </div>
    );
  }
  return <></>;
});

export default ResultsText;
