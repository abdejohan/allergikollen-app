import { StyleSheet } from 'react-native';
import { View, Text } from '../../components/Themed';
import { useContext, useEffect } from 'react';
import StoreContext from '../../contexts/Store';

export default function TabOneScreen() {
  const { searches } = useContext(StoreContext);

  return (
    <View style={styles.container}>
      {searches?.map((product) => (
        <Text>{product.name}</Text>
      ))}
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
});
