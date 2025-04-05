import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: [true, 'Please add a product ID'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  slug: {
    type: String,
    lowercase: true
  },
  price: {
    type: Number,
    required: [true, 'Please add a product price'],
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['fashion', 'music', 'accessories', 'footwear', 'clothing']
  },
  culture: {
    type: String,
    required: [true, 'Please add a culture'],
    enum: ['Tokyo', 'New York', 'Lagos', 'Seoul', 'London', 'Berlin']
  },
  images: {
    type: [String],
    required: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Enable virtuals
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add a virtual for 'id' that returns the _id as a string
productSchema.virtual('id').get(function() {
  return this._id.toString();
});

// Pre-save hook to set slug if not provided
productSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product; 