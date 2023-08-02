import { PageResult, Result } from "@/types";
import React from "react";
import styles from "./DocumentResult.module.css";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import ReactImageMagnify from "react-image-magnify";
import 'react-horizontal-scrolling-menu/dist/styles.css';


type Props = {
  result: Result;
};

const DocumentResult: React.FC<Props> = ({ result }) => {
  return (
    <div className={styles.Container}>
      <div className={styles.ResultTopBar}>
        <div className={styles.DocumentName}>{result.s3_object_name}</div>
        {result.topper && (
          <div className={styles.Topper}>
            {`${result.topper.name} | AIR ${result.topper.rank || "-"} | ${
              result.topper.year || "-"
            }`}
          </div>
        )}
      </div>
      <div className={styles.Pages}>
        <ScrollMenu>
          {result.pages.map((page: PageResult, index: number) => (
            <div
              className={styles.PageResult}
              itemID={page.s3_img_object_name}
              key={page.s3_img_object_name}
            >
              <div className={styles.PageNumber}>
                {`Page # ${page.page_number}`}
              </div>
              <div className={styles.PageImage}>
                <ReactImageMagnify
                  enlargedImagePosition="beside"
                  enlargedImageContainerClassName={
                    styles.EnlargedImageContainer
                  }
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
          ))}
        </ScrollMenu>
      </div>
    </div>
  );
};

export default DocumentResult;
