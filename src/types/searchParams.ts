export interface TagValue {
    tagText: string;
    children?: TagValue;
}

export type TagType = "GS1" | "GS2" | "GS3" | "GS4" | "Essay";

export interface Tag {
    type: TagType;
    level: "l1" | "l2" | "l3";
    value: TagValue;
}

export interface DocumentType {
    type: 0 | 1 | 2;
};
