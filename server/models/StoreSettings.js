import mongoose from 'mongoose';

const storeSettingsSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: [true, 'Store name is required'],
    default: 'ITEC Store'
  },
  storeEmail: {
    type: String,
    required: [true, 'Store email is required'],
    default: 'contact@itecstore.com'
  },
  storePhone: {
    type: String,
    default: '+1 123-456-7890'
  },
  storeLogo: {
    type: String,
    default: '/images/logo.png'
  },
  storeAddress: {
    type: String,
    default: '123 Tech Street, Digital City, 10001'
  },
  socialLinks: {
    facebook: {
      type: String,
      default: 'https://facebook.com/itecstore'
    },
    instagram: {
      type: String,
      default: 'https://instagram.com/itecstore'
    },
    twitter: {
      type: String,
      default: 'https://twitter.com/itecstore'
    }
  },
  shipping: {
    domesticRate: {
      type: Number,
      default: 5.99
    },
    internationalRate: {
      type: Number,
      default: 15.99
    },
    freeShippingThreshold: {
      type: Number,
      default: 50
    }
  },
  payment: {
    acceptedMethods: {
      type: [String],
      default: ['credit_card', 'paypal']
    },
    currency: {
      type: String,
      default: 'USD'
    },
    taxRate: {
      type: Number,
      default: 7.5
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// We're using a singleton design because there's only one store settings document
storeSettingsSchema.statics.getSingleton = async function() {
  const count = await this.countDocuments();
  if (count === 0) {
    // If no settings exist, create default settings
    return await this.create({});
  }
  // Return the first (and only) settings document
  return await this.findOne();
};

const StoreSettings = mongoose.model('StoreSettings', storeSettingsSchema);

export default StoreSettings; 