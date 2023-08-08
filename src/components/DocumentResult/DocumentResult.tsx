import { PageResult, Result } from "@/types";
import React from "react";
import styles from "./DocumentResult.module.css";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import ReactImageMagnify from "react-image-magnify";
import "react-horizontal-scrolling-menu/dist/styles.css";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import "./ScrollContainer.css";

type Props = {
  result: Result;
};

type PageViewProps = {
  page: PageResult;
  itemId: string;
};

const PageView: React.FC<PageViewProps> = ({ page, itemId }) => {
  return (
    <div className={styles.PageResult} key={page.s3_img_object_name}>
      <div className={styles.PageNumber}>{`Page # ${page.page_number}`}</div>
      <div className={styles.PageImage}>
        <ReactImageMagnify
          enlargedImagePosition="beside"
          enlargedImageContainerClassName={styles.EnlargedImageContainer}
          key={page.s3_signed_url}
          {...{
            smallImage: {
              alt: "Wristwatch by Ted Baker London",
              isFluidWidth: true,
              src: page.s3_signed_url,
            },
            largeImage: {
              src: page.s3_signed_url,
              width: 500,
              height: 1000,
            },
          }}
        />
      </div>
      {page.matching_words && (
        <div className={styles.MatchingKeywords}>
          Matching Keywords: {page.matching_words.join(", ")}
        </div>
      )}
    </div>
  );
};

type ArrowProps = {
  type: "front" | "back";
};

const Arrow: React.FC<ArrowProps> = ({ type }) => {
  const { isLastItemVisible, isFirstItemVisible, scrollNext, scrollPrev } =
    React.useContext(VisibilityContext);

  return (
    <div
      className={clsx(
        styles.Arrow,
        type === "front" && isLastItemVisible && styles.ArrowHidden,
        type === "back" && isFirstItemVisible && styles.ArrowHidden
      )}
      onClick={() => type === "front" ? scrollNext() : scrollPrev()}
    >
      <div className={styles.ArrowCircle}>{type === "front" ? ">" : "<"}</div>
    </div>
  );
};

const DocumentResult: React.FC<Props> = ({ result }) => {
  return (
    <ScrollMenu
      LeftArrow={<Arrow type="back" />}
      RightArrow={<Arrow type="front" />}
      wrapperClassName={styles.Container}
      scrollContainerClassName={styles.ScrollContainer}
      Header={
        <div className={styles.ResultTopBar}>
          <div className={styles.DocumentName}>
            {" "}
            <Icon
              icon="ph:file-pdf
"
            />{" "}
            {result.s3_object_name}
          </div>
          {result.topper && (
            <div className={styles.Topper}>
              {`${result.topper.name} | AIR ${result.topper.rank || "-"} | ${
                result.topper.year || "-"
              }`}
            </div>
          )}
        </div>
      }
    >
      {result.pages.map((page: PageResult, index: number) => (
        <PageView page={page} itemId={page.s3_img_object_name} key={index} />
      ))}
    </ScrollMenu>
  );
};

export default DocumentResult;
