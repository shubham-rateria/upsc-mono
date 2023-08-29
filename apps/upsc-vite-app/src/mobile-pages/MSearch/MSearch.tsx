import { Dropdown } from "semantic-ui-react";
import MTopBarLayout from "../mTopNavBarLayout";
import styles from "./MSearch.module.css";
import { EmptyPagePlaceholder } from "../../components/EmptyPagePlaceholder/EmptyPagePlaceholder";

const countryOptions = [
  { key: "af", value: "GS1", text: "General Studies I" },
  { key: "ax", value: "GS2", text: "General Studies II" },
  { key: "al", value: "GS3", text: "General Studies III" },
  { key: "dz", value: "GS4", text: "General Studies IV" },
  { key: "as", value: "Essay", text: "Essay" },
  { key: "ad", value: "ad", text: "Andorra" },
  { key: "ao", value: "ao", text: "Angola" },
  { key: "ai", value: "ai", text: "Anguilla" },
  { key: "ag", value: "ag", text: "Antigua" },
  { key: "ar", value: "ar", text: "Argentina" },
  { key: "am", value: "am", text: "Armenia" },
  { key: "aw", value: "aw", text: "Aruba" },
  { key: "au", value: "au", text: "Australia" },
  { key: "at", value: "at", text: "Austria" },
  { key: "az", value: "az", text: "Azerbaijan" },
  { key: "bs", value: "bs", text: "Bahamas" },
  { key: "bh", value: "bh", text: "Bahrain" },
  { key: "bd", value: "bd", text: "Bangladesh" },
  { key: "bb", value: "bb", text: "Barbados" },
  { key: "by", value: "by", text: "Belarus" },
  { key: "be", value: "be", text: "Belgium" },
  { key: "bz", value: "bz", text: "Belize" },
  { key: "bj", value: "bj", text: "Benin" },
];

const MSearch = () => {
  return (
    <MTopBarLayout>
      <div className={styles.SearchInputContainer}>
        <div>
          <Dropdown
            placeholder="Select subject"
            fluid
            search
            selection
            options={countryOptions}
            clearable
          />
        </div>
        <div>
          <Dropdown
            placeholder="Search for a keyword"
            fluid
            search
            selection
            options={countryOptions}
            clearable
          />
        </div>
      </div>
      <div className={styles.EmptyContainer}>
        <EmptyPagePlaceholder
          imgSrc="/img/decide.svg"
          title="Start a new search"
          description="Use the filters or enter any keyword to perform a search"
        ></EmptyPagePlaceholder>
      </div>
    </MTopBarLayout>
  );
};

export default MSearch;
