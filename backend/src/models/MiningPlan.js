import mongoose from 'mongoose';

const miningPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  mineType: {
    type: String,
    required: true,
    enum: ['opencast', 'underground', 'hybrid']
  },
  mineralType: {
    type: String,
    required: true
  },
  estimatedProduction: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true,
      enum: ['tons', 'kg']
    }
  },
  timeline: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected'],
    default: 'draft'
  },
  documents: [{
    name: String,
    fileUrl: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

miningPlanSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('MiningPlan', miningPlanSchema);