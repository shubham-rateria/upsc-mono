import { FC, useState } from "react";
import { PageResult } from "usn-common";
import axiosInstance from "../../../utils/axios-instance";
import { InView } from "react-intersection-observer";
import { Loader } from "semantic-ui-react";
import useStateRef from "react-usestateref";

type Props = {
  page: PageResult | undefined;
  pageNumber: number;
  scrollToPageNumber: number;
};

const PAGE_LOAD_DELTA = 1000;

class PageTimer {
  public timer: any = null;
  triggerFunc: () => boolean;

  constructor(triggerFunc: () => boolean) {
    this.triggerFunc = triggerFunc;
  }

  public startTimer() {
    const timer = setInterval(() => {
      const res = this.triggerFunc();
      if (res) {
        clearInterval(timer);
      }
    }, PAGE_LOAD_DELTA);
    this.timer = timer;
  }

  public stopTimer() {
    if (!this.timer) {
      return;
    }
    clearInterval(this.timer);
  }
}

const Page: FC<Props> = ({ page, pageNumber }) => {
  const [signedUrl, setSignedUrl] = useState();
  const [_error, setError] = useState(false);
  const [_errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingCount, setLoadingCount] = useState(0);
  const [_loaded, setLoaded, loadedRef] = useStateRef(false);
  const [_entryTime, setEntryTime, entryTimeRef] = useStateRef(0);
  const [timer, _] = useState(
    new PageTimer(() => {
      if (loadedRef.current) {
        return true;
      } else {
        if (Date.now() - entryTimeRef.current > 0) {
          init();
          return true;
        }
      }
      return false;
    })
  );

  const init = async () => {
    setLoadingCount(loadingCount + 1);
    if (loadedRef.current) {
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/documents/signed_page/${page?._ref?.$id}`
      );
      setSignedUrl(response.data.data.signed_url);
      setLoaded(true);
    } catch (error) {
      setError(true);
      setErrorMessage("Failed to load page");
    }
    setLoading(false);
  };

  return (
    <InView
      as="div"
      threshold={0.2}
      onChange={(inView, _page) => {
        if (inView) {
          setEntryTime(Date.now());
          timer.startTimer();
        } else {
          timer.stopTimer();
        }
      }}
      data-page-number={pageNumber}
    >
      <div
        style={{
          minHeight: "70vh",
          border: "1px solid #d6d6d6",
          borderRadius: "10px",
          background: "white",
        }}
      >
        {loading && (
          <div>
            <Loader active>Loading Page...</Loader>
          </div>
        )}
        <img
          style={{
            borderRadius: "10px",
            width: "100%",
          }}
          src={signedUrl}
        />
      </div>
    </InView>
  );
};

export default Page;
