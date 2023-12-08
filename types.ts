export type Product = {
  name: string;
  brand: string;
  category: string;
  countryOfOrigin: string;
  provenanceStatement: string;
  supplierArticleNumber: string[];
  gtin: string;
  lastChangeDate: string;
  ingredientStatement: string;
};

export type User = {
  id: number;
  email: string;
  username: string;
  allergens: string[];
};
