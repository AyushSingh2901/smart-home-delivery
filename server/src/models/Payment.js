import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    gateway: { type: String, enum: ['razorpay', 'mock'], default: 'mock' },
    orderId: String,
    paymentId: String,
    status: { type: String, enum: ['created', 'paid', 'failed', 'refunded'], default: 'created' },
    meta: Object
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);

