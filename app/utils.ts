import { Product, ProductImage } from './types';

export const getImages = (product: Product): ProductImage[] => {
    if (!product.images) return [];
    return product.images.map(img =>
        typeof img === 'string' ? { url: img, name: '' } : img
    );
};
