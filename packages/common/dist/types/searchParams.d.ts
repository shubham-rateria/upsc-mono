export interface TagValue {
    tagText: string;
}
export type TagType = "GS1" | "GS2" | "GS3" | "GS4" | "Essay" | "Optionals";
export type TagLevel = "l0" | "l1" | "l2";
export interface Tag {
    type: TagType;
    level: TagLevel;
    value: TagValue;
    optionalsId?: number;
}
export type DocumentType = -1 | 0 | 1 | 2;
export type Topper = {
    name?: string;
    rank?: number;
    year?: number;
};
export interface SearchParams {
    keyword?: string;
    subjectTags?: Tag[];
    documentType?: DocumentType;
    topper?: Topper;
    year?: number;
    favourites?: boolean;
    pageNumber?: number;
}
