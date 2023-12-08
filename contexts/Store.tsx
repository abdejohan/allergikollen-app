import {
  useState,
  FunctionComponent,
  useMemo,
  useEffect,
  createContext,
} from 'react';
import { Product, User } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../utils';

type ContextType = {
  isSignedIn: boolean;
  productData: Product | null;
  setProductData: (productData: Product | null) => void;
  fetchProduct: (gtin: string) => void;
  getUser: (userId: number) => void;
  patchUserAllergens: (allergens: string[]) => void;
  searches: Product[];
  setSearches: (productArr: Product[]) => void;
  user: User | null;
};

type StoreContextProps = {
  children: React.ReactNode;
};

const StoreContext = createContext<ContextType>({
  isSignedIn: false,
  productData: null,
  setProductData: () => {},
  patchUserAllergens: () => {},
  fetchProduct: () => {},
  searches: [],
  setSearches: () => {},
  getUser: () => {},
  user: null,
});

export const StoreContextProvider: FunctionComponent<StoreContextProps> = (
  props: StoreContextProps
) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [searches, setSearches] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [productData, setProductData] = useState<Product | null>(null);

  const storeData = async (product: Product) => {
    try {
      const oldSearchesArray = await getData();
      if (oldSearchesArray) {
        const newArr = oldSearchesArray.filter(
          (prod: Product) => prod.gtin !== product.gtin
        );
        newArr.push(product);
        const jsonValue = JSON.stringify(newArr);
        await AsyncStorage.setItem('oldSearchResults', jsonValue);
      } else {
        const jsonValue = JSON.stringify([product]);
        await AsyncStorage.setItem('oldSearchResults', jsonValue);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('oldSearchResults');
      const oldSearches = jsonValue != null ? JSON.parse(jsonValue) : null;
      return oldSearches;
    } catch (e) {
      console.log(e);
    }
  };

  const fetchSearchResults = async () => {
    const response = await getData();
    setSearches(response);
  };

  const fetchUser = async () => {
    try {
      const user = await getUser();
      setUser(user);
      fetchSearchResults();
    } catch (error) {
      return null;
    }
  };

  const clearAll = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    // Only runs once when the application starts
    //clearAll();
    fetchUser();
  }, []);

  const fetchProduct = async (gtin: string) => {
    try {
      const productResult = await fetch(`${API_URL}/products/${gtin}`);
      const fetchData = await productResult.json();
      setProductData(fetchData);
      storeData(fetchData);
    } catch (error) {
      setProductData(null);
      console.log(error);
    }
  };

  const patchUserAllergens = async (allergens: string[]) => {
    try {
      const productResult = await fetch(`${API_URL}/users/1/allergens`, {
        method: 'PATCH',
        body: JSON.stringify({ allergens: allergens }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const fetchData = await productResult.json();
      return fetchData;
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async (userId = 1) => {
    try {
      const productResult = await fetch(`${API_URL}/users/${userId}`);
      const user = await productResult.json();
      return user;
    } catch (error) {
      console.log(error);
    }
  };

  const state = useMemo(
    () => ({
      isSignedIn,
      setIsSignedIn,
      productData,
      setProductData,
      fetchProduct,
      searches,
      setSearches,
      patchUserAllergens,
      getUser,
      user,
      setUser,
    }),
    [
      isSignedIn,
      setIsSignedIn,
      productData,
      setProductData,
      fetchProduct,
      searches,
      setSearches,
      patchUserAllergens,
      getUser,
      user,
      setUser,
    ]
  );

  return (
    <StoreContext.Provider value={state}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContext;
