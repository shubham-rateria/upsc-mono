import { PageResult, Result } from "usn-common";
import React, { useContext, useState } from "react";
import styles from "./DocumentResult.module.css";
// @ts-ignore
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import clsx from "clsx";
import "./ScrollContainer.css";
import ImageMagnifier from "../ImageMagnifier/ImageMagnifier";
import {
  ImageMagnifierContext,
  MagnifierClass,
} from "./contexts/ImageMagnifierContext/ImageMagnifierContext";
import { observer } from "mobx-react-lite";
import { Label } from "semantic-ui-react";
import globalStyles from "../../styles/global.module.css";

type Props = {
  result: Result;
};

const l0ToString: any = {
  1: "General Studies I",
  2: "General Studies II",
  3: "General Studies III",
  4: "General Studies IV",
  5: "Essay",
  6: "Anthro",
  7: "Chemistry",
  8: "Economics",
  9: "Geography",
  10: "Hindi",
  11: "Law",
  12: "Management",
  13: "Philosophy",
  14: "Political Science",
  15: "Public Administration",
  16: "Sociology",
  17: "Agriculture",
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

const magnifierClass = new MagnifierClass();

type MagnifierViewerProps = {
  documentId: string;
};

const MagnifierViewer: React.FC<MagnifierViewerProps> = observer(
  ({ documentId }) => {
    const mClass = useContext(ImageMagnifierContext);
    const [magWidth, _setMagWidth] = useState(window.innerWidth * 0.3);
    const [magHeight, _setMagHeight] = useState(magWidth / 1.2);
    const [zoomLevel, _] = useState(3);

    if (!mClass.showMagnifier || mClass.activeDocumentId !== documentId) {
      return <></>;
    }

    const getLeft = () => {
      const topRight =
        mClass.imgProperties.left + mClass.imgProperties.width + magWidth + 40;
      if (topRight > window.innerWidth) {
        return mClass.imgProperties.left - magWidth - 50;
      } else {
        return mClass.imgProperties.left + mClass.imgProperties.width + 30;
      }
    };

    const getTop = () => {
      return (
        mClass.imgProperties.top +
        mClass.imgProperties.height / 2 -
        magHeight / 2
      );
    };

    return (
      <div
        style={{
          position: "absolute",
          top: `${getTop()}px`,
          left: `${getLeft()}px`,
          // boxShadow: "0px 0px 20px -8px rgba(0,9,72,0.2)",
          boxShadow: "4px 4px 20px 0px rgba(0, 0, 0, 0.25)",
          borderRadius: "12px",
          padding: "10px",
          background: "white",
          zIndex: 100,
        }}
      >
        <div
          style={{
            width: magWidth,
            height: magHeight,
            backgroundImage: `url('${mClass.src}')`,
            backgroundRepeat: "no-repeat",

            //calculate zoomed image size
            backgroundSize: `${mClass.imgProperties.width * zoomLevel}px ${
              mClass.imgProperties.height * zoomLevel
            }px`,

            // //calculate position of zoomed image.
            backgroundPositionX: `${
              -mClass.imgZoomCoords.relX * zoomLevel + magWidth / 2
            }px`,
            backgroundPositionY: `${
              -mClass.imgZoomCoords.relY * zoomLevel + magHeight / 2
            }px`,
          }}
        />
        <div className={styles.MagnifierData}>
          {mClass.pageMetadata.matchingWords.length > 0 && (
            <div className={styles.MatchingWords}>
              Matching words:{" "}
              <span className={styles.Keyword}>
                {mClass.pageMetadata.matchingWords.join(", ")}
              </span>
            </div>
          )}
          {/* <div className={styles.PageNumber}>
            Page {mClass.pageMetadata.pageNumber}
          </div> */}
        </div>
      </div>
    );
  }
);

const DocumentResult: React.FC<Props> = ({ result }) => {
  const canShowTopper = () => {
    return (
      result.topper &&
      result.topper.name &&
      result.topper.rank &&
      result.topper.year
    );
  };

  return (
    <ImageMagnifierContext.Provider value={magnifierClass}>
      <MagnifierViewer
        key={`${result._id}#${magnifierClass.pageMetadata.pageNumber}`}
        documentId={result._id ?? ""}
      />
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
                {result.s3_object_name}{" "}
                <div className={styles.L0Tags}>
                  {result.l0_categories?.map(
                    (category: number, index: number) => (
                      <Label className={globalStyles.LabelPrimary} key={index}>
                        {l0ToString[category]}
                      </Label>
                    )
                  )}
                </div>
                <span className={styles.NumPages}>
                  {result.num_pages} Pages
                </span>
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
                  <div className={styles.Name}>{result.topper?.name}</div>
                  <div className={styles.Details}>
                    {result.topper?.year} - AIR {result.topper?.rank}
                  </div>
                </div>
              )}
            </div>
          }
        >
          {result.pages.map((page: PageResult, index: number) => (
            <div className={styles.PageResult} key={page.s3_img_object_name}>
              <div className={styles.PageImage}>
                <ImageMagnifier
                  id={`result-page-${index}`}
                  src={page.s3_signed_url ?? ""}
                  pageMetadata={{
                    pageNumber: page.page_number,
                    matchingWords: page.matching_words ?? [],
                  }}
                  documentId={result._id ?? ""}
                />
                <div
                  className={styles.PageNumber}
                >{`Page # ${page.page_number}`}</div>
              </div>
            </div>
          ))}
        </ScrollMenu>
      </div>
    </ImageMagnifierContext.Provider>
  );
};

export default DocumentResult;
