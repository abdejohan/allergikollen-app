import { Product as ProductType } from '../types';
import { Text, StyleSheet, View, Image } from 'react-native';

type ProductProps = {
  product: ProductType;
  matches: string[];
};

const Product = ({ product, matches }: ProductProps) => {
  return (
    <View
      style={[
        styles.container,
        { borderColor: matches.length ? 'red' : 'green' },
      ]}>
      <Image
        style={styles.image}
        height={150}
        source={{ uri: product.image }}
      />
      <Text>{product.brand}</Text>
      <Text>{product.name}</Text>
      <Text>{product.countryOfOrigin}</Text>
      {matches.length ? (
        <>
          <Text style={styles.resultText}>AVOID THIS PRODUCT</Text>
          <Text style={styles.containsText}>
            CONTAINS: {matches.map((e) => e)}
          </Text>
        </>
      ) : (
        <Text style={styles.resultText}>SAFE TO EAT</Text>
      )}
    </View>
  );
};

export default Product;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 2,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  resultText: {
    marginTop: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containsText: {
    textAlign: 'center',
  },
  image: {
    objectFit: 'contain',
  },
});
