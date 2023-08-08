import React, { useState, useEffect } from "react";
import styles from "./DocumentViewer.module.css";
import TopNavBar from "@/components/TopNavbar/TopNavBar";
import { ApiError, Result } from "@/types";
import axios from "axios";

type Props = {
  params: {
    documentId: string;
  };
};

const DocumentViewerPage: React.FC<Props> = ({ params }) => {
  const [document, setDocument] = useState<Result>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError>({
    error: false,
    message: "",
  });

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/documents/${params.documentId}`);
        setDocument(response.data);
      } catch (error: any) {
        setError({
          error: true,
          message: error.message,
        });
      }
    };

    init();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error.error) {
    return <div>Error in loading document. {error.message}</div>
  }

  return (
    <div className={styles.Container}>
      <div className={styles.TopNavContainer}>
        <TopNavBar />
      </div>
      <div className={styles.PageContainer}>
        <div className={styles.DocumentViewerContainer}></div>
        <div className={styles.DocumentDetails}>
          <div className={styles.Card}>
            <div className={styles.DocumentName}>
              {document?.s3_object_name}
            </div>
            <div className={styles.NumPages}>{document?.num_pages} pages</div>
          </div>
          <div className={styles.Card}>
            <div className={styles.TopperHeader}>Topper Details</div>
            <div className={styles.TopperName}>{document?.topper?.name}</div>
            <div className={styles.TopperRank}>{document?.topper?.rank}</div>
            <div className={styles.TopperYear}>{document?.topper?.year}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerPage;
