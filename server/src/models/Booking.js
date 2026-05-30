import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    scheduledFor: { type: Date, required: true },
    address: {
      line1: String,
      city: String,
      state: String,
      pincode: String
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [77.209, 28.6139] }
    },
    notes: String,
    urgent: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    price: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Pending' },
    statusTimeline: [
      {
        status: String,
        by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        at: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

bookingSchema.index({ location: '2dsphere' });

export default mongoose.model('Booking', bookingSchema);

