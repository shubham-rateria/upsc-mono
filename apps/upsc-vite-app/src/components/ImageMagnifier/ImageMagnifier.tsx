import { useContext, useState } from "react";
import {
  ImageMagnifierContext,
  PageMetadata,
} from "../DocumentResult/contexts/ImageMagnifierContext/ImageMagnifierContext";
import styles from "./ImageMagnifier.module.css";

function ImageMagnifier({
  src,
  id,
  magnifierHeight = 100,
  magnifierWidth = 100,
  pageMetadata,
  documentId,
  onClick,
  triggerAnalyticsEvent,
}: {
  src: string;
  magnifierHeight?: number;
  magnifierWidth?: number;
  pageMetadata: PageMetadata;
  documentId: string;
  id?: string;
  onClick: () => void;
  triggerAnalyticsEvent: (timeSpent: number) => void;
}) {
  const [[x, y], setXY] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [enterTime, setEnterTime] = useState(-1);
  const imageMagnifierContext = useContext(ImageMagnifierContext);

  return (
    <div style={{ position: "relative" }} id={id}>
      <div
        style={{
          position: "relative",
          overflowX: "hidden",
          overflowY: "hidden",
        }}
      >
        <img
          src={src}
          className={styles.Img}
          onClick={onClick}
          onMouseEnter={(e) => {
            setEnterTime(Date.now());
            // update image size and turn-on magnifier
            const elem = e.currentTarget;
            const { top, left, width, height } = elem.getBoundingClientRect();
            if (!(imageMagnifierContext.activeDocumentId === documentId)) {
              imageMagnifierContext.setActiveDocumentId(documentId);
            }
            imageMagnifierContext.setImgProperties({
              top,
              left,
              width,
              height,
            });
            setShowMagnifier(true);
            imageMagnifierContext.setShowMagnifier(true);
            imageMagnifierContext.setPageMetadata(pageMetadata);
          }}
          onMouseMove={(e) => {
            if (imageMagnifierContext.src !== src) {
              imageMagnifierContext.setSrc(src);
            }

            // update cursor position
            const elem = e.currentTarget;
            const { top, left } = elem.getBoundingClientRect();

            // calculate cursor position on the image
            const x = e.pageX - left - window.pageXOffset;
            const y = e.pageY - top - window.pageYOffset;
            imageMagnifierContext.setImgZoomCoords({
              x: e.pageX,
              y: e.pageY,
              relX: e.pageX - left - window.pageXOffset,
              relY: e.pageY - top - window.pageYOffset,
            });
            setXY([x, y]);
          }}
          onMouseLeave={() => {
            const time = Date.now();
            if (time - enterTime > 2000) {
              triggerAnalyticsEvent(time - enterTime);
            }
            // close magnifier
            imageMagnifierContext.setShowMagnifier(false);
            setShowMagnifier(false);
          }}
          alt={"img"}
        />

        <div
          className={styles.Lens}
          style={{
            display: showMagnifier ? "" : "none",
            position: "absolute",
            zIndex: 100,
            // prevent magnifier blocks the mousemove event of img
            pointerEvents: "none",
            // set size of magnifier
            height: `${magnifierHeight}px`,
            width: `${magnifierWidth}px`,
            // move element center to cursor pos
            top: `${y - magnifierHeight / 2}px`,
            left: `${x - magnifierWidth / 2}px`,
            marginLeft: "5px",
            opacity: "0.3", // reduce opacity so you can verify position
            //   border: "1px solid lightgray",
            backgroundColor: "#7963FF",
            color: "black",
          }}
        ></div>
      </div>
    </div>
  );
}

export default ImageMagnifier;
