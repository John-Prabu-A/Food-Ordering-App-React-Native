import { StyleSheet, Text, View, Image } from 'react-native';

import products from '@/assets/data/products';

export default function TabOneScreen() {

  const product = products[1];

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{uri: product.image }} />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: 'grey',
    fontWeight: 'light',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  }
});
