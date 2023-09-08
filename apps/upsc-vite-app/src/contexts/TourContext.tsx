import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { FC, createContext, useEffect } from "react";
import { searchParamsClass } from "./SearchParamsContext";
// import { useStytchUser } from "@stytch/react";
import axiosInstance from "../utils/axios-instance";
import { Tag } from "usn-common";
import { useNavigate } from "react-router-dom";
import { useStytchUser } from "@stytch/react";
// import { useNavigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class TourContextController {
  phone: string = "";
  primaryTour: any;
  tour1: any;
  tour2: any;
  tour3: any;
  navigator: any;

  public startPrimaryTour() {
    this.primaryTour = driver({
      popoverClass: "driverjs-theme",
      showProgress: true,
      allowClose: false,
      steps: [
        {
          popover: {
            title: "Welcome!",
            description:
              "Let us show you how powerful you can be with UPSC SmartNotes. Click next",
          },
        },
        {
          element: "#subject-select-dropdown",
          popover: {
            title: "Select any subject you want to study",
            description: "Let's select General Studies I",
            onNextClick: async () => {
              if (
                (searchParamsClass.searchParams.subjectTags || []).length === 0
              ) {
                searchParamsClass.setSearchParams({
                  subjectTags: [
                    {
                      level: "l0",
                      type: "GS1",
                      value: {
                        tagText: "GS1",
                      },
                    },
                  ],
                });
              }

              await searchParamsClass.searchForDocuments();
              // @ts-ignore
              await searchParamsClass.lastSearchPromise;
              this.primaryTour.moveNext();
            },
          },
        },
        {
          element: "#search-input",
          popover: {
            title: "You can search for any keyword",
            description: "Let's search for 'Mauryan Empire'",
            onNextClick: async () => {
              if (
                (searchParamsClass.searchParams.subjectTags || []).length === 0
              ) {
                searchParamsClass.setSearchParams({
                  subjectTags: [
                    {
                      level: "l1",
                      type: "GS1",
                      value: {
                        tagText: "Mauryan Empire",
                      },
                    },
                  ],
                });
              }

              await searchParamsClass.searchForDocuments();
              // @ts-ignore
              await searchParamsClass.lastSearchPromise;
              this.primaryTour.moveNext();
            },
          },
        },
        {
          element: "#result-page-0",
          popover: {
            title:
              "All pages where content matches your search keywords are shown in the result",
            description:
              "You can hover over the pages to read the top content at one place without needing to download the documents",
            onNextClick: async () => {
              if (!window.location.href.endsWith("/search")) {
                this.navigator("/search");
                await sleep(500);
              }
              this.primaryTour.moveNext();
            },
          },
        },
        {
          element: "#btn-sample-answers",
          popover: {
            title:
              "Think about using this powerful capability to get all the sample answers from toppers!",
            description: "You can filter notes type using this section",
            onNextClick: async () => {
              if (!(searchParamsClass.searchParams.documentType === 1)) {
                searchParamsClass.setSearchParams({ documentType: 1 });
              }
              this.primaryTour.moveNext();
            },
          },
        },
        {
          popover: {
            title: "That's all!",
            description:
              "We hope this platform helps you prepare better and ace your papers.",
          },
        },
      ],
      onDestroyed: async () => {
        try {
          await axiosInstance.post("/api/user/set-user-onboarded", {
            phone: this.phone,
          });
          // searchParamsClass.clearFilters();
        } catch (error) {
          console.error(error);
        }
      },
    });
    this.primaryTour.drive();
  }

  public startTour1() {
    searchParamsClass.clearFilters();
    this.tour1 = driver({
      popoverClass: "driverjs-theme",
      showProgress: true,
      steps: [
        {
          element: "#chkbox-GS1",
          popover: {
            title:
              "You can choose the subject to get all the materials available using this section",
            description: "Let's check out GS I here. Please click on GS I",
            onNextClick: async () => {
              const tag: Tag = {
                level: "l0",
                type: "GS1",
                value: {
                  tagText: "General Studies I",
                },
              };
              if (searchParamsClass.tagExists(tag)) {
                this.tour1.moveNext();
              } else {
                alert("Please select GS1");
              }
            },
          },
        },
        {
          element: "#document-result",
          popover: {
            title: "This is the study material list we have for GS I",
            description:
              "First few pages of the doc are shown here. You can scroll down and see other relevant study materials in this feed!",
          },
        },
        {
          element: "#document-type-selector",
          popover: {
            title:
              "This is notes type section from where you can filter for specific study material",
            description:
              "You can choose between Notes and Sample answers to get the best topper material at one place!",
            onNextClick: async () => {
              if (
                searchParamsClass.searchParams.documentType !== null &&
                searchParamsClass.searchParams.documentType !== undefined
              ) {
                this.tour1.moveNext();
              }
            },
          },
        },
      ],
    });

    this.tour1.drive();
  }

  public startTour2() {
    searchParamsClass.clearFilters();
    this.tour2 = driver({
      popoverClass: "driverjs-theme",
      showProgress: true,
      steps: [
        {
          element: "#chkbox-GS1",
          popover: {
            title:
              "This section can be used to select subject you are looking content for",
            description: "Let's select GS I here for the example",
            onNextClick: async () => {
              const tag: Tag = {
                level: "l0",
                type: "GS1",
                value: {
                  tagText: "General Studies I",
                },
              };
              if (searchParamsClass.tagExists(tag)) {
                this.tour2.moveNext();
              } else {
                alert("Please select GS1");
              }
            },
          },
        },
        {
          element: "#search-input",
          popover: {
            title: "You can use this search bar to search for any content!",
            description: "Let's search for 'indus valley' here",
            onNextClick: async () => {
              if ((searchParamsClass.searchParams.keyword || "").length > 0) {
                await searchParamsClass.searchForDocuments();
                // @ts-ignore
                await searchParamsClass.lastSearchPromise;
                this.tour2.moveNext();
              } else {
                alert("Please type a search term");
              }
            },
          },
        },
        {
          element: "#result-page-0",
          popover: {
            title:
              "You get all the pages where content matches your search keywords",
            description:
              "You can read the content in this page by hovering over it and if you like the content you can open and read the document",
            onNextClick: async () => {
              if (!window.location.href.endsWith("/search")) {
                this.navigator("/search");
              }
              this.tour2.moveNext();
            },
          },
        },
      ],
    });

    this.tour2.drive();
  }

  public startTour3() {
    searchParamsClass.clearFilters();
    this.tour3 = driver({
      popoverClass: "driverjs-theme",
      showProgress: true,
      steps: [
        {
          element: "#topper-scroll",
          popover: {
            title:
              "This section can be used to select Toppers to get their available study material",
            description: "Please click on the section to expand the list",
          },
        },
        {
          element: "#topper-search-input",
          popover: {
            title:
              "You can use this search bar to search the specific topper you want to see study material of",
            description: "Let's search for 'Dwij Goel' Sir notes here",
          },
        },
        {
          element: "#topper-scroll",
          popover: {
            title:
              "You can select Dwij Goel Sir's filter to get all their content at one place including their mock papers!",
            description: "Let's select 'Dwij Goel' option and see the results!",
          },
        },
      ],
    });

    this.tour3.drive();
  }

  public setPhone(phone: string) {
    this.phone = phone;
  }

  public setNavigator(navigator: any) {
    this.navigator = navigator;
  }

  constructor(phone: string) {
    this.phone = phone;
  }
}

const tourContextController = new TourContextController("");

export const TourContext = createContext<TourContextController>(
  tourContextController
);

const TourWrapper: FC<Props> = ({ children }) => {
  const user = useStytchUser();
  const navigator = useNavigate();

  const init = async () => {
    try {
      // const res = await axiosInstance.post("/api/user/check-user-onboarded", {
      //   phone: user.user?.phone_numbers[0].phone_number,
      // });
      // if (!res.data.onboarded) {
      //   tourContextController.startPrimaryTour();
      // }
      // tourContextController.startPrimaryTour();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    tourContextController.setPhone(
      user.user?.phone_numbers[0].phone_number || ""
    );
    tourContextController.setNavigator(navigator);
    console.log("[ttc phone]", tourContextController.phone);
    init();
  }, [user.user]);

  return (
    <TourContext.Provider value={tourContextController}>
      {children}
    </TourContext.Provider>
  );
};

export default TourWrapper;
