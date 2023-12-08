import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  useRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
  useContext,
} from 'react';
import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import StoreContext from '../../contexts/Store';
import { checkForAllergens } from '../../utils';
import Product from '../../components/Product';

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [matches, setMatches] = useState<string[]>([]);
  const { fetchProduct, productData, user, setProductData } =
    useContext(StoreContext);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string | null }) => {
    setScanned(true);
    bottomSheetRef.current?.close();
    //  fetch product from the backend
    data && fetchProduct(data);
  };

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['90%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  useEffect(() => {
    if (user && productData) {
      const allergenMatches = checkForAllergens(user?.allergens, productData);
      setMatches(allergenMatches);
    }
  }, [user, productData]);

  return (
    <View style={styles.container}>
      <View style={styles.productContainer}>
        {!productData && (
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Text variant="displaySmall">Ready to Scan</Text>
            <Ionicons name="barcode-outline" size={100} color="black" />
          </View>
        )}
        {productData && <Product product={productData} matches={matches} />}
      </View>
      <Button
        mode="contained"
        style={styles.scanButton}
        onPress={() => {
          setScanned(false);
          setProductData(null);
          bottomSheetRef.current?.expand();
        }}>
        Scan
      </Button>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        style={styles.bottomSheet}
        onChange={handleSheetChanges}>
        <View style={styles.contentContainer}>
          <Text variant="headlineMedium">Aim camera at the barcode</Text>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={styles.barCodeScanner}
          />
          <Button
            mode="contained"
            onPress={() => bottomSheetRef.current?.close()}>
            Return{' '}
          </Button>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSheet: {
    padding: 20,
    paddingBottom: 200,
    marginBottom: 200,
  },
  barCodeScanner: {
    height: 200,
    width: '100%',
    marginVertical: 20,
  },
  productContainer: {
    flex: 1,
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  scanButton: {
    marginBottom: 20,
  },
});
