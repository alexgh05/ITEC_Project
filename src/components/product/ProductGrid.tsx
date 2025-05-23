import { useState, useEffect } from 'react';
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

  // Debug logging
  useEffect(() => {
    console.log('ProductGrid received products:', products?.length || 0);
    if (products?.length === 0) {
      console.log('No products to display in ProductGrid');
    }
  }, [products]);

  // Apply filters if they exist
  const filteredProducts = products?.filter(product => {
    if (!product) return false;
    if (filters.category && product.category !== filters.category) return false;
    if (filters.culture && product.culture !== filters.culture) return false;
    return true;
  }) || [];

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
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product, index) => {
            // Ensure each product has a valid id for the key prop
            const key = product.id || product._id || `product-${index}`;
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">Products are loading...</p>
          </div>
        )}
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

      {filteredProducts.length === 0 && !products?.length && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No products found. Check back soon!</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
