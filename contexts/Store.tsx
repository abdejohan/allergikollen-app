import {
  useState,
  FunctionComponent,
  useMemo,
  useEffect,
  createContext,
} from 'react';

type ContextType = {
  isSignedIn: boolean;
  qrData: string | null;
  setQrData: (qrData: string | null) => void;
  fetchProduct: (gtin: string) => void;
};

type StoreContextProps = {
  children: React.ReactNode;
};

const StoreContext = createContext<ContextType>({
  isSignedIn: false,
  qrData: null,
  setQrData: () => {},
  fetchProduct: () => {},
});

export const StoreContextProvider: FunctionComponent<StoreContextProps> = (
  props: StoreContextProps
) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [qrData, setQrData] = useState<string | null>(null);

  useEffect(() => {
    // Only runs once when the application starts
    // Fetch firebase user here
  }, []);

  const fetchProduct = async (gtin: string) => {
    console.log('will try and fetch');

    try {
      const productResult = await fetch(
        `http://192.168.101.237:8000/api/products/${gtin}`
      );
      const fetchData = await productResult.json();
      console.log(fetchData);
    } catch (error) {
      console.log('failed to fetch');
      console.log(error);
    }
  };

  const state = useMemo(
    () => ({ isSignedIn, setIsSignedIn, qrData, setQrData, fetchProduct }),
    [isSignedIn, setIsSignedIn, qrData, setQrData, fetchProduct]
  );

  return (
    <StoreContext.Provider value={state}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContext;
