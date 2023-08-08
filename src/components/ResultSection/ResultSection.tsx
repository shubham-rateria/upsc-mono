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
      <h2 className={styles.Header}>Search Results:</h2>
      {results.map((result, index) => (
        <DocumentResult result={result} key={index}/>
      ))}
    </div>
  );
};

export default ResultSection;
