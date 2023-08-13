import React from "react";
import { Placeholder } from "semantic-ui-react";
import styles from "./DocSearchPlaceholder.module.css";

const DocSearchPlaceholder = () => (
  <div className={styles.Container}>
    <div className={styles.Topbar}>
      <div>
        <Placeholder fluid>
          <Placeholder.Line />
        </Placeholder>
      </div>
      <div>
        <Placeholder fluid>
          <Placeholder.Line />
        </Placeholder>
      </div>
      <div>
        <Placeholder fluid>
          <Placeholder.Line />
        </Placeholder>
      </div>
      <div></div>
      <div>
        <Placeholder>
          <Placeholder.Line />
        </Placeholder>
      </div>
    </div>

    <div className={styles.Images}>
      <div className={styles.Image}>
        <Placeholder fluid style={{ height: 200 }}>
          <Placeholder.Image />
        </Placeholder>
      </div>
      <div className={styles.Image}>
        <Placeholder fluid style={{ height: 200 }}>
          <Placeholder.Image />
        </Placeholder>
      </div>
      <div className={styles.Image}>
        <Placeholder fluid style={{ height: 200 }}>
          <Placeholder.Image />
        </Placeholder>
      </div>
      <div className={styles.Image}>
        <Placeholder fluid style={{ height: 200 }}>
          <Placeholder.Image />
        </Placeholder>
      </div>
      <div className={styles.Image}>
        <Placeholder fluid style={{ height: 200 }}>
          <Placeholder.Image />
        </Placeholder>
      </div>
      <div className={styles.Image}>
        <Placeholder fluid style={{ height: 200 }}>
          <Placeholder.Image />
        </Placeholder>
      </div>
    </div>
  </div>
);

export default DocSearchPlaceholder;
