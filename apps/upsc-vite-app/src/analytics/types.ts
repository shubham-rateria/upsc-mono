import { DocumentType, Topper } from "usn-common";

export type EventSubjectSelected = {
  subject_selected: string;
};

export type EventSubjectRemoved = {
  subject_selected: string;
};

export interface GeneralSearchQueries {
  notes_filter_type?: DocumentType;
  subject_selected?: string;
  text_searched?: string;
  search_type?: "keyword" | "topic";
  topper_filter_selected?: Topper;
}

export interface DocResult {
  clicked_on?: "file_name" | "page";
  feed_type?: "primary" | "secondary";
  row_no?: number;
  column_no?: number;
  document_name: string;
  pages?: number;
  pages_shown?: number;
  topper_name?: Topper | null;
  subject_tag?: string | number;
  notes_type?: DocumentType;
}

export interface EventKeywordSearchUsed extends GeneralSearchQueries {
  text_searched: string;
}

/**
 * notes_filter_type_filter_used
 * notes_filter_type= <all/ notes/ sample_answers>
 * subject_selected= <name of the subject or null if no subject was selected>
 * text_searched= <text typed and searched>
 * search_type= <keyword/ topic>
 * topper_filter_selected= <null or the topper name that's selected>
 */

export interface EventNotesFilterTypeUsed extends GeneralSearchQueries {
  notes_filter_used: boolean;
}

/**
 * topper_filter_used
 * topper_filter_selected= <null if topper was removed or the topper name that's selected>
 * notes_filter_type= <all/ notes/ sample_answers>
 * subject_selected= <name of the subject or null if no subject was selected>
 * text_searched= <text typed and searched>
 * search_type= <keyword/ topic>
 */

export interface EventTopperFilterUsed extends GeneralSearchQueries {
  used: boolean;
}

/**
 * results_shown
 * result= <pass/ fail>
 * time_taken= < in secs >
 * feed_type= <primary feed, secondary feed(only secondary loaded), zero results>
 * primary_feed_items_count= <0 if no primary feed items>
 * secondary_feed_items_count= <0 if no secondary feed items in first load>
 * subject_selected= <name of the subject or null if no subject was selected>
 * text_searched= <text typed and searched>
 * search_type= <keyword/ topic>
 * topper_filter_selected= <null or the topper name that's selected>
 * notes_filter_type= <all/ notes/ sample_answers>
 */

export interface EventResultsShown extends GeneralSearchQueries {
  result: "pass" | "fail";
  time_taken: number;
  feed_type: "primary" | "primary, secondary" | "secondary" | "none";
  primary_feed_item_count?: number;
  secondary_feed_item_count?: number;
  pagination_page_number: number;
}

/**
 * page_hovered	
 * page_number= <page number of the document>
	feed_type= <primary feed/ secondary feed of the document>
	row_no= <number of item in the vertical list first starts with either 0 or 1>
	column_no= <number of item in the horizontal carousel first start either 0 or 1>
	time_spent= <time spent hovering>
	document_name= <name of the document>
	subject_selected= <name of the subject or null if no subject was selected for searching>
	text_searched= <text typed and searched>
	search_type= <keyword/ topic>
	topper_filter_selected= <null or the topper name that's selected from filter>
	notes_filter_type= <all/ notes/ sample_answers filter that was selected from filters>
	pages= <count of pages in doc>
	pages_shown= <count of pages shown in the result>
	topper_name= <name of the topper>
	subject_tag= <name of the subject on the doc>
	notes_type= <tag of notes_type on the doc>
 */

export interface EventPageHovered extends GeneralSearchQueries, DocResult {
  page_number: number;
  time_spent: number;
  pages_shown: number;
}

/**
 * document_clicked	
 * clicked_on= <file_name / page>
	page_number= <page number of the document>
	row_no= <number of item in the vertical list first starts with either 0 or 1/ Null if clicked on file_name>
	column_no= <number of item in the horizontal carousel first start either 0 or 1/ Null if clicked on file_name>
	feed_type= <primary feed/ secondary feed of the document>
	document_name= <name of the document>
	subject_selected= <name of the subject or null if no subject was selected for searching>
	text_searched= <text typed and searched>
	search_type= <keyword/ topic>
	topper_filter_selected= <null or the topper name that's selected from filter>
	notes_filter_type= <all/ notes/ sample_answers filter that was selected from filters>
	pages= <count of pages in doc>
	pages_shown= <count of pages shown in the result>
	topper_name= <name of the topper>
	subject_tag= <name of the subject on the doc>
	notes_type= <tag of notes_type on the doc>
 */

export interface EventDocumentClicked extends GeneralSearchQueries, DocResult {
  page_number: number;
}

/**
 * document_opened	
 * Time_taken= < in secs >
	result= <pass/ fail>
	clicked_on= <file_name / page>
	feed_type= <primary feed/ secondary feed of the document>
	row_no= <number of item in the vertical list first starts with either 0 or 1/ Null if clicked on file_name>
	column_no= <number of item in the horizontal carousel first start either 0 or 1/ Null if clicked on file_name>
	document_name= <name of the document>
	subject_selected= <name of the subject or null if no subject was selected for searching>
	text_searched= <text typed and searched>
	search_type= <keyword/ topic>
	topper_filter_selected= <null or the topper name that's selected from filter>
	notes_filter_type= <all/ notes/ sample_answers filter that was selected from filters>
	pages= <count of pages in doc>
	pages_shown= <count of pages shown in the result>
	topper_name= <name of the topper>
	subject_tag= <name of the subject on the doc>
	notes_type= <tag of notes_type on the doc>
 * 
 * 
 */

export interface EventDocumentOpened extends GeneralSearchQueries, DocResult {
  time_taken: number;
  result: "pass" | "fail";
}

/**
 * document_page_impression	
 *  page_no= <>
	clicked_on= <file_name / page>
	feed_type= <primary feed/ secondary feed of the document>
	row_no= <number of item in the vertical list first starts with either 0 or 1/ Null if clicked on file_name>
	column_no= <number of item in the horizontal carousel first start either 0 or 1/ Null if clicked on file_name>
	document_name= <name of the document>
	subject_selected= <name of the subject or null if no subject was selected for searching>
	text_searched= <text typed and searched>
	search_type= <keyword/ topic>
	topper_filter_selected= <null or the topper name that's selected from filter>
	notes_filter_type= <all/ notes/ sample_answers filter that was selected from filters>
	pages= <count of pages in doc>
	pages_shown= <count of pages shown in the result>
	topper_name= <name of the topper>
	subject_tag= <name of the subject on the doc>
	notes_type= <tag of notes_type on the doc>
 * 
 * 
 */

export interface EventDocumentPageImpression
  extends GeneralSearchQueries,
    DocResult {
  page_no: number;
  time_spent: number;
}

/**
 * search_in_doc_viewer	
 *  doc_viewer_text_searched= <text typed and searched>
	matching_results_count= <number of matches>
	clicked_on= <file_name / page>
	feed_type= <primary feed/ secondary feed of the document>
	row_no= <number of item in the vertical list first starts with either 0 or 1/ Null if clicked on file_name>
	column_no= <number of item in the horizontal carousel first start either 0 or 1/ Null if clicked on file_name>
	document_name= <name of the document>
	subject_selected= <name of the subject or null if no subject was selected for searching>
	text_searched= <text typed and searched>
	search_type= <keyword/ topic>
	topper_filter_selected= <null or the topper name that's selected from filter>
	notes_filter_type= <all/ notes/ sample_answers filter that was selected from filters>
	pages= <count of pages in doc>
	pages_shown= <count of pages shown in the result>
	topper_name= <name of the topper>
	subject_tag= <name of the subject on the doc>
	notes_type= <tag of notes_type on the doc>
 * 
 * 
 */

export interface EventSearchInDocViewer
  extends GeneralSearchQueries,
    DocResult {
  doc_viewer_text_searched: string;
  matching_results_count: number;
}

export interface EventDocViewerSearchNav {
  // result_no= < integer number of item jumped to>
  // jump_to=<next_match / previous_match>
  // doc_viewer_text_searched= <text typed and searched>
  current_result_no: number;
  jump_to: number;
  doc_viewer_text_search: string;
}

export interface EventDocumentViewerExited
  extends GeneralSearchQueries,
    DocResult {
  exited_through: "back_button" | "closed_tab";
  time_spent: number;
}

/**
 * Login based events
 */

/**
 * otp_requested
 * phone_number= <>
 * attempt_number= <0 for first request otp clicked, 1 and onwards for resend clicked>
 * login
 * phone_number= <>
 * attempt_number= <0 for first request otp clicked, 1 and onwards for resend clicked>
 * result= <pass/ fail>
 * logout
 * phone_number= <>
 * result= <pass/ fail>
 *
 */

export interface EventOtpRequested {
  phone_number: string;
  attempt_number: number;
}

export interface EventLogin {
  phone_number: string;
  attempt_number: number;
  result: "pass" | "fail";
}

export interface EventLogout {
  phone_number: string;
  result: "pass" | "fail";
}
