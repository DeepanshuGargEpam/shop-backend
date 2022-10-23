import { Product } from '../../models/products';

import { Service } from '../types';
import { InMemoryProductService } from './InMemoryProductService';

export const ProductService: Service<Product> = new InMemoryProductService();
