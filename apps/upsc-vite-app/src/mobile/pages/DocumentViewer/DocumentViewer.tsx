import React, { useState, useEffect, useContext } from "react";
import styles from "./DocumentViewer.module.css";
import { ApiError, MatchingBlock, PageResult, Result } from "usn-common";
import "./DocumentViewer.css";
import { Button, Icon, Modal } from "semantic-ui-react";
import { InView } from "react-intersection-observer";
import { range, truncate } from "lodash";
import axiosInstance from "../../../utils/axios-instance";
import { useNavigate } from "react-router-dom";
import Page from "../../components/Page/Page";
import { UserContext } from "../../../contexts/UserContextProvider";
import config from "../../../config";

function loadScript(src: string) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

const DocumentViewerPage: React.FC = () => {
  const navigate = useNavigate();
  const [documentId, setDocumentId] = useState<string | null>();
  const [document, setDocument] = useState<Result>();
  const [loading, setLoading] = useState(true);
  // const [documentLoadingPercent, setDocumentLoadingPercent] = useState(0);
  const [currentActivePage, setCurrentActivePage] = useState<number | null>(
    null
  );
  const [documentSearchResult, _setDocumentSearchResult] =
    useState<Result | null>(null);
  const [_currentDocSearchResultIdx, _setCurrentDocSearchResultIdx] = useState<
    number | null
  >(0);
  const [_documentSearchText, _setDocumentSearchText] = useState<string | null>(
    null
  );
  const [_fileDownloading, setFileDownloading] = useState(false);
  const user = useContext(UserContext);
  const [_searchLoading, _setSearchLoading] = useState(false);
  const [noDownloadModalOpen, setNoDownloadModalOpen] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [openPaidDownloadModal, setOpenPaidDownloadModal] = useState(false);
  const [paidDownloadDone, setPaidDownloadDone] = useState(false);

  const [error, setError] = useState<ApiError>({
    error: false,
    message: "",
  });

  const urlParams = new URLSearchParams(window.location.search);

  const scrollToPageNumber = (pageNumber: string | number) => {
    const el = window.document.querySelector(
      `[data-page-number="${pageNumber}"]`
    );
    if (el) {
      el.scrollIntoView({
        // behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentActivePage(pageNumber);
  };

  const getMatchingResultsForPage = (
    pageNumber: number
  ): PageResult | undefined => {
    if (documentSearchResult) {
      const filtered = documentSearchResult?.pages.filter(
        (r: any) => r.page_number === pageNumber
      );
      if (filtered.length > 0) {
        return filtered[0];
      }
    }
    return undefined;
  };

  const getHeightForPage = (pageNumber: number): number => {
    if (documentSearchResult) {
      const filtered = documentSearchResult?.pages.filter(
        (r: any) => r.page_number === pageNumber
      );
      if (filtered.length > 0) {
        return filtered[0].height || 1;
      }
    }
    return 1;
  };

  const getWidthForPage = (pageNumber: number): number => {
    if (documentSearchResult) {
      const filtered = documentSearchResult?.pages.filter(
        (r: any) => r.page_number === pageNumber
      );
      if (filtered.length > 0) {
        return filtered[0].width || 1;
      }
    }
    return 1;
  };

  const skewX = (pageNumber: number): number => {
    const el = window.document.querySelector(
      `[data-page-number="${pageNumber}"]`
    );
    const elemWidth = el?.clientWidth ?? 0;
    return elemWidth / getWidthForPage(pageNumber);
  };

  const skewY = (pageNumber: number): number => {
    const el = window.document.querySelector(
      `[data-page-number="${pageNumber}"]`
    );
    const elemHeight = el?.clientHeight ?? 0;
    return elemHeight / getHeightForPage(pageNumber);
  };

  const handleBack = () => {
    // router.back();
    navigate(-1);
  };

  const handleDownload = async (e: any) => {
    e.stopPropagation();
    setFileDownloading(true);
    // const urlParams = new URLSearchParams(window.location.search);

    // analyticsClass.triggerDocDownloadClicked({
    //   page_number: parseInt(urlParams.get("pageNumber") || "-1"),
    //   ...analyticsData,
    //   document_name: document?.s3_object_name || "",
    //   column_no: parseInt(urlParams.get("colNo") || "-1"),
    //   // @ts-ignore
    //   feed_type: urlParams.get("feedType") || "primary",
    //   row_no: parseInt(urlParams.get("rowNo") || "-1"),
    //   result: "pass",
    //   time_taken: Date.now() - docLoadStartTime,
    //   downloads_left: user.remainingDownloads.free,
    //   free_downloads_left: user.remainingDownloads.free,
    // });

    if (user.remainingDownloads.free <= 0) {
      // setOpenReferralModal(true);
      // analyticsClass.triggerReferNowClicked({
      //   accessed_from: 1,
      //   downloads_left: user.remainingDownloads.free,
      //   free_downloads_left: user.remainingDownloads.free,
      //   user_type: 0,
      //   used: true,
      //   paid_downloads_left: 0,
      // });
      setNoDownloadModalOpen(true);
      setFileDownloading(false);
      return;
    }

    // setNoDownloadModalOpen(true);
    try {
      const response = await axiosInstance.get(`/api/documents/${documentId}`);
      const url = response.data.data.s3_signed_url;
      const element = window.document.createElement("a");
      element.style.display = "none";
      window.document.body.appendChild(element);
      element.setAttribute("href", url);
      element.setAttribute("target", "_blank");
      element.className = self.name;
      element.click();

      // analyticsClass.triggerDocDownloadStarted({
      //   page_number: parseInt(urlParams.get("pageNumber") || "-1"),
      //   ...analyticsData,
      //   document_name: document?.s3_object_name || "",
      //   column_no: parseInt(urlParams.get("colNo") || "-1"),
      //   // @ts-ignore
      //   feed_type: urlParams.get("feedType") || "primary",
      //   row_no: parseInt(urlParams.get("rowNo") || "-1"),
      //   result: "pass",
      //   time_taken: Date.now() - docLoadStartTime,
      //   downloads_left: user.remainingDownloads.free,
      //   free_downloads_left: user.remainingDownloads.free,
      // });

      window.document.body.removeChild(element);
      const data = {
        fileS3ObjectName: response.data.data.s3_object_name,
        userId: user.userId,
        downloaded_through_plan: 0,
      };
      await axiosInstance.post("/api/usage/file-download", data);
      await user.getRemainingDownloads();
    } catch (error) {
      console.log("Could not download part", error);
    }
    setFileDownloading(false);
  };

  const handleReferralClick = () => {
    if (user.referralCode && user.referralCode.length > 0) {
      navigator.clipboard.writeText(user.referralCode || "");
      setShowCopied(true);
    } else {
      console.error("error copying code");
    }
  };

  const payToDownload = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const result = await axiosInstance.post("/api/payments/orders");

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    const { amount, id: order_id, currency } = result.data;

    const options = {
      key: config.RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: "SmartNotes Solutions LLP",
      description: "File Download",
      image: "https://www.upscsmartnotes.com/img/logo.svg",
      order_id: order_id,
      handler: async function (response: any) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          userId: user.userId,
          documentObjectName: document?.s3_object_name || "",
        };

        const result = await axiosInstance.post("/api/payments/success", data);

        if (result.data.valid) {
          setOpenPaidDownloadModal(true);
        }
      },
      notes: {
        address: "Soumya Dey Corporate Office",
      },
      theme: {
        color: "#7963FF",
      },
    };

    // @ts-ignore
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setNoDownloadModalOpen(false);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const documentId = urlParams.get("documentId");
      setDocumentId(documentId);

      const pageNumber = urlParams.get("page");

      if (pageNumber) {
        setTimeout(() => {
          scrollToPageNumber(pageNumber);
        }, 1000);
      }

      try {
        const response = await axiosInstance.get(
          `/api/documents/${documentId}`
        );
        setDocument(response.data.data);
      } catch (error: any) {
        setError({
          error: true,
          message: error.message,
        });
      }
      setLoading(false);
    };

    init();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error.error) {
    return <div>Error in loading document. {error.message}</div>;
  }

  return (
    <div>
      <Modal
        size="tiny"
        open={openPaidDownloadModal}
        onClose={() => {
          setOpenPaidDownloadModal(false);
        }}
        closeIcon
      >
        <Modal.Content className={styles.PaidDownloadModal}>
          <div className={styles.Heading}>
            <img src="/icons/do-checkbox.svg" />
            <div>Payment Successful</div>
          </div>
          <div className={styles.Description}>
            Thank you for your purchase. Please click the button below to
            download the document.
          </div>
          <div>
            <Button
              icon
              className={styles.DownloadButton}
              labelPosition="left"
              onClick={handleDownload}
            >
              <Icon name="download" />
              Download
            </Button>
          </div>
        </Modal.Content>
      </Modal>
      <Modal
        open={noDownloadModalOpen}
        onClose={() => {
          setNoDownloadModalOpen(false);
        }}
        size="tiny"
        closeOnEscape
        closeIcon
      >
        <Modal.Content className={styles.PaymentModal}>
          <div className={styles.LogoContainer}>
            <img src="/img/logo.svg" alt="Logo" />
            <div className={styles.Tagline}>
              Get the most out of UPSC SmartNotes
            </div>
          </div>
          <div className={styles.ReferCard}>
            <div className={styles.InnerContainer}>
              <div className={styles.LogoCircle}>
                <img src="/icons/sr-snowflake.svg" />
              </div>
              <div className={styles.Text}>
                <div className={styles.Heading}>Refer to download</div>
                <div className={styles.Description}>
                  You can refer UPSC SmartNotes to your friends and on every
                  successful registration you get <b>2 downloads free</b>.
                </div>
              </div>
            </div>

            <div className={styles.ReferContainer}>
              <div>Referral Code</div>
              <div className={styles.CodeContainer}>
                <div className={styles.Code}>{user.referralCode}</div>
                <div className={styles.Icon} onClick={handleReferralClick}>
                  <img src="/icons/do-copy.svg" />
                </div>
                {showCopied && (
                  <div className={styles.Copied}>Copied to clipboard!</div>
                )}
              </div>
            </div>
            {/* <div className={styles.Button}>
              <Button className={styles.ActionBtn}>Refer Now!</Button>
            </div> */}
          </div>
          <div>OR</div>
          <div className={styles.DownloadCard}>
            <div className={styles.LogoContainer}>
              <img src="/icons/download-cloud.svg" />
              <div>
                <b>Download Only</b>
              </div>
            </div>
            <div className={styles.Prices}>
              <div className={styles.Heading}>Rs. 20</div>
              <div className={styles.Slashed}>Rs. 50</div>
            </div>
            <div className={styles.Tagline}>
              Pay as little as 20 INR to download any document
            </div>
            <div>
              <Button className={styles.ActionBtn} onClick={payToDownload}>
                Pay for one download
              </Button>
            </div>
          </div>
        </Modal.Content>
      </Modal>
      <div className={styles.PageContainer}>
        <div className={styles.DocumentViewerContainer}>
          <div className={styles.DocumentTopBar}>
            <div className={styles.TopbarItem}>
              <div className={styles.BackButton} onClick={handleBack}>
                <img src="/icons/do-arrow-back.svg" />
                Back
              </div>
              <div>{truncate(document?.s3_object_name, { length: 30 })}</div>
            </div>
            <div className={styles.TopbarItem}>
              <div>
                <Button
                  size="mini"
                  icon="download"
                  className={styles.DownloadButton}
                  onClick={handleDownload}
                >
                  Download
                </Button>
              </div>
              <div className={styles.DownloadsRemaining}>
                {user.remainingDownloads.free} download(s) remaining
              </div>
              <div className={styles.DocumentSearchInput}></div>
              {(!documentSearchResult ||
                documentSearchResult?.pages.length === 0) && (
                <div className={styles.PageNumber}>
                  {currentActivePage || ""} / {document?.num_pages}
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              overflowY: "scroll",
              gap: "1rem",
              height: "90vh",
            }}
          >
            {range(document?.num_pages || 0).map((index: number) => (
              <div className={styles.Page} key={index}>
                {getMatchingResultsForPage(index + 1)?.matching_blocks?.map(
                  (block: MatchingBlock, idx: number) => (
                    <div
                      className={styles.MatchingResults}
                      key={idx}
                      style={{
                        color: "blue",
                        background: "purple",
                        opacity: 0.3,
                        top: `${
                          (block.boundingBox.vertices[0].y * 100) /
                          getHeightForPage(index + 1)
                        }%`,
                        left: `${
                          (block.boundingBox.vertices[0].x * 100) /
                          getWidthForPage(index + 1)
                        }%`,
                        width: `${
                          skewX(index + 1) *
                          (block.boundingBox.vertices[1].x -
                            block.boundingBox.vertices[0].x)
                        }px`,
                        height: `${
                          skewY(index + 1) *
                          (block.boundingBox.vertices[3].y -
                            block.boundingBox.vertices[0].y)
                        }px`,
                      }}
                    />
                  )
                )}
                <InView
                  as="div"
                  threshold={0.8}
                  onChange={() => {
                    handlePageChange(index + 1);
                  }}
                >
                  <Page
                    page={document?.pages[index]}
                    pageNumber={index + 1}
                    scrollToPageNumber={parseInt(urlParams.get("page") || "-1")}
                  />
                </InView>
              </div>
            ))}
          </div>

          {/* <Document
            file={document?.s3_signed_url}
            className={styles.Document}
            onLoadSuccess={handlePdfLoadSuccess}
            onLoadProgress={({ loaded, total }) => {
              setDocumentLoadingPercent((loaded * 100) / total);
            }}
            loading={
              <div className={styles.DocumentLoadingContainer}>
                <Progress
                  className={styles.DocLoadProgress}
                  active
                  percent={documentLoadingPercent.toFixed(0)}
                  // progress
                  size="tiny"
                >
                  Loading <span>{document?.s3_object_name} </span>
                </Progress>
              </div>
            }
          >
            {range(document?.num_pages || 0).map((index: number) => (
              <div className={styles.Page} key={index}>
                {getMatchingResultsForPage(index + 1)?.matching_blocks?.map(
                  (block: MatchingBlock, idx: number) => (
                    <div
                      className={styles.MatchingResults}
                      key={idx}
                      style={{
                        color: "blue",
                        background: "purple",
                        opacity: 0.3,
                        top: `${
                          (block.boundingBox.vertices[0].y * 100) /
                          getHeightForPage(index + 1)
                        }%`,
                        left: `${
                          (block.boundingBox.vertices[0].x * 100) /
                          getWidthForPage(index + 1)
                        }%`,
                        width: `${
                          skewX(index + 1) *
                          (block.boundingBox.vertices[1].x -
                            block.boundingBox.vertices[0].x)
                        }px`,
                        height: `${
                          skewY(index + 1) *
                          (block.boundingBox.vertices[3].y -
                            block.boundingBox.vertices[0].y)
                        }px`,
                      }}
                    />
                  )
                )}
                <InView
                  as="div"
                  threshold={0.8}
                  onChange={() => {
                    handlePageChange(index + 1);
                  }}
                >
                  <Page
                    pageNumber={index + 1}
                    width={window.innerWidth * 0.9}
                  />
                </InView>
              </div>
            ))}
          </Document> */}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerPage;
