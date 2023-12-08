import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import BottomSheet from '@gorhom/bottom-sheet';
import { useRef, useMemo, useState, useEffect, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import StoreContext from '../../contexts/Store';
import { checkForAllergens } from '../../utils';
import Product from '../../components/Product';
import { gs } from '../../styles';

export default function ScanScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [matches, setMatches] = useState<string[]>([]);
  const { fetchProduct, productData, user, setProductData, searches } =
    useContext(StoreContext);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      // @ts-ignore
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string | null }) => {
    setScanned(true);
    bottomSheetRef.current?.close();
    data && fetchProduct(data);
  };

  // variables
  const snapPoints = useMemo(() => ['100%'], []);

  useEffect(() => {
    if (user && productData) {
      const allergenMatches = checkForAllergens(user?.allergens, productData);
      setMatches(allergenMatches);
    }
  }, [user, productData]);

  return (
    <View style={{ ...gs.container, backgroundColor: 'white' }}>
      <View style={styles.productContainer}>
        {!productData && (
          <View style={{ alignItems: 'center' }}>
            <Text variant="displaySmall">SafePlate</Text>
            <Text variant="labelLarge">Ingredient Alert System</Text>
            <Ionicons name="barcode-outline" size={100} color="black" />
            <View style={styles.searches}>
              <Text variant="labelLarge">Recent scans</Text>
              {searches?.map((product) => (
                <Text style={styles.searchItem} key={product.gtin}>
                  {product.name}
                </Text>
              ))}
            </View>
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
        detached>
        <View style={styles.contentContainer}>
          <Text variant="headlineSmall" style={{ textAlign: 'center' }}>
            Scan products
          </Text>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={styles.barCodeScanner}
          />
          <Button
            mode="contained"
            style={styles.scanButton}
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
  searches: {
    marginTop: 30,
    width: '100%',
    gap: 10,
  },
  searchItem: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
  },
  bottomSheet: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
    margin: 20,
  },
  barCodeScanner: {
    height: 270,
    width: '100%',
    marginVertical: 20,
  },
  productContainer: {
    flex: 1,
    width: '100%',
    marginBottom: 20,
  },

  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  contentContainer: {
    flex: 1,
  },
  scanButton: {
    marginBottom: 20,
    borderRadius: 5,
  },
});
