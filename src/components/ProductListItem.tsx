import { StyleSheet, Text, View, Image } from 'react-native';

const ProductListItem = ({ product }) => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{uri: product.image }} />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
    </View>
  );
};

export default ProductListItem;

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
