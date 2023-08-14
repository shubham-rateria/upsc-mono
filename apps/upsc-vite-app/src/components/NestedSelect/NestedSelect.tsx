import React from "react";

export interface Category {
  // id: number;
  name: string;
  children: Category[];
}

type CategoryOptionProps = {
  category: Category;
};

// Recursive component to handle nested categories
const CategoryOption: React.FC<CategoryOptionProps> = ({ category }) => {
  return (
    <React.Fragment>
      <option value={category.name}>{category.name}</option>
      {category.children.map((child) => (
        <CategoryOption key={child.name} category={child} />
      ))}
    </React.Fragment>
  );
};

type SelectCategoriesProps = {
  categories: Category[];
};

// The main SelectCategories component
export const NestedSelect: React.FC<SelectCategoriesProps> = ({ categories }) => {
  return (
    <select>
      <option value="">Select a category</option>
      {categories.map((category: Category, index: number) => (
        <CategoryOption key={index} category={category} />
      ))}
    </select>
  );
};
