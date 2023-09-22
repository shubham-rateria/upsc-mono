import { createContext } from "react";
import {
  EventDocDownloadClicked,
  EventDocDownloadStarted,
  EventDocViewerSearchNav,
  EventDocumentClicked,
  EventDocumentOpened,
  EventDocumentPageImpression,
  EventDocumentViewerExited,
  EventKeywordSearchUsed,
  EventLogin,
  EventLogout,
  EventNotesFilterTypeUsed,
  EventOtpRequested,
  EventPageHovered,
  EventReferNowClicked,
  EventReferralCodeCopied,
  EventResultsShown,
  EventSearchInDocViewer,
  EventSubjectRemoved,
  EventSubjectSelected,
  EventTopperFilterUsed,
} from "./types";
import mixpanel from "mixpanel-browser";

export class AnalyticsClass {
  public triggerSubjectSelected(event: EventSubjectSelected) {
    console.log("event:subject-selected", { event });
    mixpanel.track("subject-selected", event);
  }

  public triggerSubjectRemoved(event: EventSubjectRemoved) {
    console.log("event:subject-removed", { event });
    mixpanel.track("subject-removed", event);
  }

  public triggerKeywordSearchUsed(event: EventKeywordSearchUsed) {
    console.log("event:keyword-search-used", { event });
    mixpanel.track("keyword-search-used", event);
  }

  public triggerNotesTypesFilterUsed(event: EventNotesFilterTypeUsed) {
    console.log("event:notes-type-filter", { event });
    mixpanel.track("notes-type-filter-used", event);
  }

  public triggerTopperFilterUsed(event: EventTopperFilterUsed) {
    console.log("event:topper-filter-used", { event });
    mixpanel.track("topper-filter-used", event);
  }

  public triggerResultsShown(event: EventResultsShown) {
    console.log("event:results-shown", { event });
    mixpanel.track("results-shown", event);
  }

  public triggerPageHovered(event: EventPageHovered) {
    console.log("event:page-hovered", { event });
    mixpanel.track("page-hovered", event);
  }

  public triggerDocumentClicked(event: EventDocumentClicked) {
    console.log("event:doc-clicked", { event });
    mixpanel.track("doc-clicked", event);
  }

  public triggerDocumentOpened(event: EventDocumentOpened) {
    console.log("event:doc-opened", { event });
    mixpanel.track("doc-opened", event);
  }

  public triggerDocumentPageImpression(event: EventDocumentPageImpression) {
    console.log("event:doc-page-impression", { event });
    mixpanel.track("doc-page-impression", event);
  }

  public triggerSearchInDocViewer(event: EventSearchInDocViewer) {
    console.log("event:search-in-doc-viewer", { event });
    mixpanel.track("search-in-doc-viewer", event);
  }

  public triggerDocViewerSearchNav(event: EventDocViewerSearchNav) {
    console.log("event:doc-viewer-search-nav", event);
    mixpanel.track("doc-viewer-search-nav", event);
  }

  public triggerOtpRequested(event: EventOtpRequested) {
    console.log("event:otp-requested", event);
    mixpanel.track("otp-requested", event);
  }

  public triggerLogin(event: EventLogin) {
    console.log("event:login", event);
    mixpanel.track("login", event);
  }

  public triggerLogout(event: EventLogout) {
    console.log("event:logout", event);
    mixpanel.track("logout", event);
  }

  public triggerDocViewExited(event: EventDocumentViewerExited) {
    console.log("event:doc-viewer-exited", event);
    mixpanel.track("doc-viewer-exited", event);
  }

  public triggerDocDownloadClicked(event: EventDocDownloadClicked) {
    console.log("event:doc-download-clicked", event);
    mixpanel.track("doc-download-clicked", event);
  }

  public triggerDocDownloadStarted(event: EventDocDownloadStarted) {
    console.log("event:doc-download-started", event);
    mixpanel.track("doc-download-started", event);
  }

  public triggerReferNowClicked(event: EventReferNowClicked) {
    console.log("event:refer-now-clicked", event);
    mixpanel.track("refer-now-clicked", event);
  }

  public triggerReferNowCopied(event: EventReferralCodeCopied) {
    console.log("event:referral-code-copied", event);
    mixpanel.track("referral-code-copied", event);
  }
}

export const analyticsClass = new AnalyticsClass();

export const AnalyticsClassContext =
  createContext<AnalyticsClass>(analyticsClass);
