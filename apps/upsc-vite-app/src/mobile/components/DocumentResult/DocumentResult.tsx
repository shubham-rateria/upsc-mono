import { PageResult, Result } from "usn-common";
import React from "react";
import styles from "./DocumentResult.module.css";
// @ts-ignore
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import clsx from "clsx";
import "./ScrollContainer.css";
import { startCase, truncate } from "lodash";
import { useNavigate } from "react-router-dom";

type Props = {
  result: Result;
};

const ArrowRight: React.FC = () => {
  // @ts-ignore
  const { isLastItemVisible, isFirstItemVisible, scrollNext, scrollPrev } =
    React.useContext(VisibilityContext);

  return (
    <div
      className={clsx(styles.Arrow, isLastItemVisible && styles.ArrowHidden)}
      onClick={() => scrollNext()}
    >
      <div className={clsx(styles.ArrowCircle, styles.Right)}>
        <img src={"/icons/do-chevron-forward.svg"} alt="icon" />
      </div>
    </div>
  );
};

const ArrowLeft: React.FC = () => {
  // @ts-ignore
  const { isLastItemVisible, isFirstItemVisible, scrollNext, scrollPrev } =
    React.useContext(VisibilityContext);

  return (
    <div
      className={clsx(styles.Arrow, isFirstItemVisible && styles.ArrowHidden)}
      onClick={() => scrollPrev()}
    >
      <div className={clsx(styles.ArrowCircle, styles.Left)}>
        <img src={"/icons/do-chevron-backward.svg"} alt="icon" />
      </div>
    </div>
  );
};

const DocumentResult: React.FC<Props> = ({ result }) => {
  const navigate = useNavigate();

  const canShowTopper = () => {
    return (
      result.topper &&
      result.topper.name &&
      result.topper.rank &&
      result.topper.year
    );
  };

  const handlePageClick = (pageNumber: number) => {
    navigate(`/view-document/?page=${pageNumber}&documentId=${result._id}`);
  };

  return (
    <div id="document-result">
      <ScrollMenu
        LeftArrow={<ArrowLeft />}
        RightArrow={<ArrowRight />}
        wrapperClassName={styles.Container}
        scrollContainerClassName={styles.ScrollContainer}
        Header={
          <div className={styles.ResultTopBar}>
            <div className={styles.DocumentName}>
              <img src="/icons/do-document-text.svg" alt="document text" />
              {truncate(result.s3_object_name, { length: 30 })}{" "}
              <span className={styles.NumPages}>{result.num_pages} Pages</span>
            </div>
            {canShowTopper() && (
              <div className={styles.Topper}>
                <div>
                  <img
                    className={styles.Icon}
                    src="/icons/do-ribbon.svg"
                    alt="icon"
                  />
                </div>
                <div className={styles.Name}>
                  {startCase(result.topper?.name?.toLowerCase() || "")}
                </div>
                <div className={styles.Details}>
                  {result.topper?.year} - AIR {result.topper?.rank}
                </div>
              </div>
            )}
          </div>
        }
      >
        {result.pages.map((page: PageResult) => (
          <div className={styles.PageResult} key={page.s3_img_object_name}>
            <div className={styles.PageImage}>
              <img
                src={page.s3_signed_url}
                onClick={() => {
                  handlePageClick(page.page_number);
                }}
              />
              <div
                className={styles.PageNumber}
              >{`Page # ${page.page_number}`}</div>
            </div>
          </div>
        ))}
      </ScrollMenu>
    </div>
  );
};

export default DocumentResult;
