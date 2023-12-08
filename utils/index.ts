import { Product } from '../types';

export const checkForAllergens = (
  arrayOfAllergens: string[],
  product: Product
) => {
  return arrayOfAllergens.filter((allergen) =>
    product.ingredientStatement.includes(allergen)
  );
};

export const API_URL =
  'https://allergikollen-api-production.up.railway.app/api';
