import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    icon: String,
    description: String,
    basePrice: { type: Number, required: true },
    durationMinutes: { type: Number, default: 60 },
    isEmergencyEnabled: { type: Boolean, default: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Service', serviceSchema);

