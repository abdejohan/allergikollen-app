import {
  useState,
  FunctionComponent,
  useMemo,
  useEffect,
  createContext,
} from 'react';
import { Product } from '../types';

type ContextType = {
  isSignedIn: boolean;
  productData: Product | null;
  setProductData: (productData: Product | null) => void;
  fetchProduct: (gtin: string) => void;
};

type StoreContextProps = {
  children: React.ReactNode;
};

const StoreContext = createContext<ContextType>({
  isSignedIn: false,
  productData: null,
  setProductData: () => {},
  fetchProduct: () => {},
});

export const StoreContextProvider: FunctionComponent<StoreContextProps> = (
  props: StoreContextProps
) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [productData, setProductData] = useState<Product | null>(null);

  useEffect(() => {
    // Only runs once when the application starts
    // Fetch firebase user here
  }, []);

  const fetchProduct = async (gtin: string) => {
    try {
      const productResult = await fetch(
        `http://192.168.101.237:8000/api/products/${gtin}`
      );
      const fetchData = await productResult.json();
      setProductData(fetchData);
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
    }),
    [isSignedIn, setIsSignedIn, productData, setProductData, fetchProduct]
  );

  return (
    <StoreContext.Provider value={state}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContext;
