import { Text } from 'react-native-paper';
import { Product as ProductType } from '../types';
import { StyleSheet, View, Image } from 'react-native';

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
      <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
        {product.brand} - {product.name}
      </Text>
      <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>
        Category <Text>{product.category.split('-')[1].trim()}</Text>
      </Text>
      <Text>
        <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>
          Origin{' '}
        </Text>
        {product.countryOfOrigin}
      </Text>
      {matches.length ? (
        <View>
          <Text style={styles.resultText}>Caution: Detected Ingredient</Text>
          {matches.map((e) => (
            <Text key={e} style={styles.containsText}>
              {e.toUpperCase()}
            </Text>
          ))}
        </View>
      ) : (
        <Text style={styles.resultText}>Ingredient Safe: Enjoy!</Text>
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
    gap: 5,
  },
  resultText: {
    marginTop: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containsText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'red',
  },
  image: {
    objectFit: 'contain',
  },
});
