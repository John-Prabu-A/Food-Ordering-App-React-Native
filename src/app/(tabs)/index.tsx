import { View } from 'react-native';

import ProductListItem from '@/src/components/ProductListItem';
import products from '@/assets/data/products';

export default function MenuScreen() {
  return (
    <View>
      <ProductListItem product={products[0]} />
    </View>
  );
}