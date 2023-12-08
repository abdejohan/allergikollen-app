import { Product } from '../types';

export const checkForAllergens = (
  arrayOfAllergens: string[],
  product: Product
) => {
  return arrayOfAllergens.filter((allergen) =>
    product.ingredientStatement.includes(allergen)
  );
};

export const API_URL = 'http://192.168.1.127:8000/api';
