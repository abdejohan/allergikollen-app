import { Product } from '../types';

export const checkForAllergens = (
  arrayOfAllergens: string[],
  product: Product
) => {
  const checkForIngredient = (word: string) => {
    const pattern = new RegExp(word, 'i');
    return pattern.test(product.ingredientStatement);
  };

  return arrayOfAllergens.filter((allergen) => checkForIngredient(allergen));
};

export const API_URL =
  'https://allergikollen-api-production.up.railway.app/api';
