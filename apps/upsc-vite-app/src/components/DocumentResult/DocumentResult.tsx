import { PageResult, Result } from "../..//types";
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

type ArrowProps = {
  type: "front" | "back";
};

const l0ToString: any = {
  1: "General Studies I",
  2: "General Studies II",
  3: "General Studies III",
  4: "General Studies IV",
  5: "Essay",
};

const Arrow: React.FC<ArrowProps> = ({ type }) => {
  // @ts-ignore
  const { isLastItemVisible, isFirstItemVisible, scrollNext, scrollPrev } =
    React.useContext(VisibilityContext);

  return (
    <div
      className={clsx(
        styles.Arrow,
        type === "front" && isLastItemVisible && styles.ArrowHidden,
        type === "back" && isFirstItemVisible && styles.ArrowHidden
      )}
      onClick={() => (type === "front" ? scrollNext() : scrollPrev())}
    >
      <div className={styles.ArrowCircle}>{type === "front" ? ">" : "<"}</div>
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
    const [magWidth, _setMagWidth] = useState(400);
    const [magHeight, _setMagHeight] = useState(400);
    // const [zoomLevel, _] = useState(2);

    if (!mClass.showMagnifier || mClass.activeDocumentId !== documentId) {
      return <></>;
    }

    const getLeft = () => {
      const topRight =
        mClass.imgProperties.left + mClass.imgProperties.width + magWidth;
      if (topRight > window.screen.width) {
        console.log("[getLeft]:returning left", topRight, window.screen.width);
        return mClass.imgProperties.left - magWidth - 30;
      } else {
        console.log("[getLeft]:returning right", topRight, window.screen.width);
        return mClass.imgProperties.left + mClass.imgProperties.width + 10;
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
          boxShadow: "0px 0px 20px -8px rgba(0,9,72,0.2)",
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
            backgroundSize: `${mClass.imgProperties.width * 2}px ${
              mClass.imgProperties.height * 2
            }px`,

            // //calculate position of zoomed image.
            backgroundPositionX: `${
              -mClass.imgZoomCoords.relX * 2 + mClass.imgProperties.width / 2
            }px`,
            backgroundPositionY: `${
              -mClass.imgZoomCoords.relY * 2 + magWidth / 2
            }px`,
          }}
        />
        <div className={styles.MagnifierData}>
          <div className={styles.PageNumber}>
            Page {mClass.pageMetadata.pageNumber}
          </div>
          <div className={styles.MatchingWords}>
            {mClass.pageMetadata.matchingWords.join(", ")}
          </div>
        </div>
      </div>
    );
  }
);

const DocumentResult: React.FC<Props> = ({ result }) => {
  return (
    <ImageMagnifierContext.Provider value={magnifierClass}>
      <MagnifierViewer documentId={result._id ?? ""} />
      <ScrollMenu
        LeftArrow={<Arrow type="back" />}
        RightArrow={<Arrow type="front" />}
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
              <span className={styles.NumPages}>{result.num_pages} Pages</span>
            </div>
            {result.topper && (
              <div className={styles.Topper}>
                <div>
                  <img
                    className={styles.Icon}
                    src="/icons/do-ribbon.svg"
                    alt="icon"
                  />
                </div>
                <div className={styles.Name}>{result.topper.name}</div>
                <div className={styles.Details}>
                  {result.topper.year} - AIR {result.topper.rank}
                </div>
              </div>
            )}
          </div>
        }
      >
        {result.pages.map((page: PageResult) => (
          <div className={styles.PageResult} key={page.s3_img_object_name}>
            <div className={styles.PageImage}>
              <ImageMagnifier
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
    </ImageMagnifierContext.Provider>
  );
};

export default DocumentResult;
