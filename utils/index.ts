import { Product } from '../types';

export const checkForAllergens = (
  arrayOfAllergens: string[],
  product: Product
) => {
  return arrayOfAllergens.filter((allergen) =>
    product.ingredientStatement.includes(allergen)
  );
};
