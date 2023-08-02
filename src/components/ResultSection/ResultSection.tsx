import React, { FC } from "react";
import styles from "./ResultSection.module.css";
import { Result } from "@/types";
import { truncate } from "lodash";
import ReactImageMagnify from "react-image-magnify";
import { Label } from "semantic-ui-react";
import DocumentResult from "../DocumentResult/DocumentResult";

type Props = {
  results: Result[];
};

const ResultSection: FC<Props> = ({ results }) => {
  return (
    <div>
      <h2>Search Results:</h2>
      {/* <div>
        {results.map((result, index) => (
          <div key={`pages-${index}`}>
            <div className={styles.ResultHeader}>
              <div className={styles.FileName}>{result.s3_object_name}</div>
              <div>
                <Label>{result.num_pages} pages</Label>
              </div>
              {result.topper?.rank && (
                <div
                  style={{
                    marginLeft: "1rem",
                  }}
                >
                  <Label>{result.topper?.rank}</Label>
                </div>
              )}
              {result.topper?.name && (
                <div
                  style={{
                    marginLeft: "1rem",
                  }}
                >
                  <Label>{result.topper?.name}</Label>
                </div>
              )}
              {result.topper?.year && (
                <div
                  style={{
                    marginLeft: "1rem",
                  }}
                >
                  <Label>{result.topper?.year}</Label>
                </div>
              )}
            </div>
            <div className={styles.ResultGrid}>
              {result.pages.map((page, index) => (
                <div key={index} className={styles.ResultCard}>
                  <div className={styles.ImageContainer}>
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
                  <div className={styles.DetailsContainer}>
                    <div className={styles.ResultsText}>
                      {page.matching_words?.join(", ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div> */}
      {results.map((result, index) => (
        <DocumentResult result={result} key={index}/>
      ))}
    </div>
  );
};

export default ResultSection;
