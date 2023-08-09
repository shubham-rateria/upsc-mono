export interface TagValue {
    tagText: string;
}

export type TagType = "GS1" | "GS2" | "GS3" | "GS4" | "Essay" | "Optionals";
export type TagLevel = "l0" | "l1" | "l2";

export interface Tag {
    type: TagType;
    level: TagLevel;
    value: TagValue;
}

export type DocumentType = {
    type: 0 | 1 | 2;
};

export interface SearchParams {
    keyword?: string;
    tag?: Tag | null;
    documentType?: DocumentType
}
