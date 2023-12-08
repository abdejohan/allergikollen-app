import {
  useState,
  FunctionComponent,
  useMemo,
  useEffect,
  createContext,
} from 'react';
import { Product, User } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ContextType = {
  isSignedIn: boolean;
  productData: Product | null;
  setProductData: (productData: Product | null) => void;
  fetchProduct: (gtin: string) => void;
  getUser: (userId: number) => void;
  patchUserAllergens: (allergens: Product[]) => void;
  searches: Product[];
  setSearches: (productArr: Product[]) => void;
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
        oldSearchesArray.push(product);
        const jsonValue = JSON.stringify(oldSearchesArray);
        await AsyncStorage.setItem('oldSearchResults', jsonValue);
      } else {
        const jsonValue = JSON.stringify([product]);
        await AsyncStorage.setItem('oldSearchResults', jsonValue);
      }
    } catch (e) {
      console.log(e);
      // saving error
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('oldSearchResults');
      const oldSearches = jsonValue != null ? JSON.parse(jsonValue) : null;
      return oldSearches;
    } catch (e) {
      console.log(e);
      // error reading value
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
      console.log('logged in user: ', user);
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    // Only runs once when the application starts
    fetchUser();
  }, []);

  const fetchProduct = async (gtin: string) => {
    try {
      const productResult = await fetch(
        `http://192.168.101.237:8000/api/products/${gtin}`
      );
      const fetchData = await productResult.json();
      setProductData(fetchData);
      storeData(fetchData);
    } catch (error) {
      console.log('failed to fetch');
      console.log(error);
    }
  };

  const patchUserAllergens = async (allergens: Product[]) => {
    try {
      const productResult = await fetch(
        `http://192.168.101.237:8000/api/users/1/allergens`,
        {
          body: JSON.stringify(allergens),
        }
      );
      const fetchData = await productResult.json();
      return fetchData;
    } catch (error) {
      console.log('failed to fetch');
      console.log(error);
    }
  };

  const getUser = async (userId = 1) => {
    try {
      const productResult = await fetch(
        `http://192.168.101.237:8000/api/users/${userId}`
      );
      const user = await productResult.json();
      return user;
    } catch (error) {
      console.log('failed to fetch');
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
    ]
  );

  return (
    <StoreContext.Provider value={state}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContext;
