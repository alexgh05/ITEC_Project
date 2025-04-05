import mongoose from 'mongoose';

const stockNotificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  isNotified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure uniqueness of email and product combination
stockNotificationSchema.index({ email: 1, product: 1 }, { unique: true });

const StockNotification = mongoose.model('StockNotification', stockNotificationSchema);

export default StockNotification; 