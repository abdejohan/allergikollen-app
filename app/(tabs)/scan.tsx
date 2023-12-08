import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  useRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
  useContext,
} from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import StoreContext from '../../contexts/Store';

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { fetchProduct, productData } = useContext(StoreContext);

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

  return (
    <View style={styles.container}>
      <Text>{productData?.gtin}</Text>
      <Button
        onPress={() => {
          setScanned(false);
          bottomSheetRef.current?.expand();
        }}>
        Scan
      </Button>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}>
        <View style={styles.contentContainer}>
          <Button onPress={() => bottomSheetRef.current?.close()}>Close</Button>
          <Text>Awesome 🎉</Text>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
});
