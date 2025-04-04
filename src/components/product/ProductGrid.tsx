
import { useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard, { Product } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  filters?: {
    category?: string;
    culture?: string;
  };
}

const ProductGrid = ({ products, filters = {} }: ProductGridProps) => {
  const [visibleProducts, setVisibleProducts] = useState(8);

  // Apply filters if they exist
  const filteredProducts = products.filter(product => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.culture && product.culture !== filters.culture) return false;
    return true;
  });

  const displayedProducts = filteredProducts.slice(0, visibleProducts);
  const hasMore = visibleProducts < filteredProducts.length;

  const loadMore = () => {
    setVisibleProducts(prev => prev + 8);
  };

  return (
    <div className="space-y-8">
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {displayedProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      {hasMore && (
        <div className="flex justify-center">
          <button 
            onClick={loadMore}
            className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
          >
            Load More
          </button>
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No products found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
