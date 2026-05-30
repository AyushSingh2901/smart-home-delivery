import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    headline: String,
    bio: String,
    photo: String,
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    skills: [String],
    pricing: [
      {
        service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
        price: Number
      }
    ],
    availability: {
      days: [String],
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '19:00' }
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [77.209, 28.6139] }
    },
    serviceRadiusKm: { type: Number, default: 12 },
    verified: { type: Boolean, default: false },
    emergencyAvailable: { type: Boolean, default: false },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 }
    },
    earnings: { type: Number, default: 0 },
    totalJobs: { type: Number, default: 0 },
    online: { type: Boolean, default: false }
  },
  { timestamps: true }
);

providerSchema.index({ location: '2dsphere' });

export default mongoose.model('Provider', providerSchema);

