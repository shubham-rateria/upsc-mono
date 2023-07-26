import { Category } from "@/components/NestedSelect/NestedSelect";

export const convertToCategoryType = (data: any): Category[] => {
  if (Array.isArray(data)) {
    // Base case for arrays, return an empty array
    return [];
  }

  return Object.entries(data).map(([name, children]) => ({
    id: 0, // Set an appropriate ID here if applicable
    name,
    children: convertToCategoryType(children)
  }));
};