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
};

type StoreContextProps = {
  children: React.ReactNode;
};

const StoreContext = createContext<ContextType>({
  isSignedIn: false,
  qrData: null,
  setQrData: () => {},
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

  const state = useMemo(
    () => ({ isSignedIn, setIsSignedIn, qrData, setQrData }),
    [isSignedIn, setIsSignedIn, qrData, setQrData]
  );

  return (
    <StoreContext.Provider value={state}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContext;
