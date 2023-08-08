export interface TagValue {
    tagText: string;
    children?: TagValue;
}

export type TagType = "GS1" | "GS2" | "GS3" | "GS4" | "Essay" | "Optionals";

export interface Tag {
    type: TagType;
    level: "l0" | "l1" | "l2";
    value: TagValue;
}

export interface DocumentType {
    type: 0 | 1 | 2;
};

export interface SearchParams {
    keyword?: string;
    tag?: Tag | null;
    documentType?: DocumentType
}
