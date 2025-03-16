import mongoose from 'mongoose';

const ebookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['mining_techniques', 'safety_guidelines', 'environmental_compliance', 'legal_framework', 'equipment_maintenance', 'other']
  },
  fileUrl: {
    type: String,
    required: true
  },
  coverImage: {
    type: String
  },
  accessLevel: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free'
  },
  downloads: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    downloadDate: {
      type: Date,
      default: Date.now
    }
  }],
  publishDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileFormat: {
    type: String,
    required: true,
    enum: ['pdf', 'epub', 'mobi']
  },
  tags: [{
    type: String,
    trim: true
  }],
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
});

ebookSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

export default mongoose.model('Ebook', ebookSchema);