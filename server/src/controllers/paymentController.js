import crypto from 'crypto';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';

export const createPaymentOrder = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.body.bookingId);
    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    const payment = await Payment.create({
      booking: booking._id,
      customer: req.user._id,
      provider: booking.provider,
      amount: booking.price,
      orderId: `order_demo_${Date.now()}`,
      gateway: 'mock'
    });

    res.status(201).json({
      success: true,
      order: {
        id: payment.orderId,
        amount: payment.amount * 100,
        currency: 'INR',
        key: process.env.RAZORPAY_KEY_ID
      },
      payment
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, paymentId = `pay_demo_${Date.now()}`, signature = 'demo' } = req.body;
    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      res.status(404);
      throw new Error('Payment order not found');
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'demo')
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    payment.paymentId = paymentId;
    payment.status = signature === 'demo' || signature === expectedSignature ? 'paid' : 'failed';
    payment.meta = { signatureVerified: payment.status === 'paid' };
    await payment.save();

    await Booking.findByIdAndUpdate(payment.booking, { paymentStatus: payment.status === 'paid' ? 'Paid' : 'Failed' });
    res.json({ success: true, payment });
  } catch (error) {
    next(error);
  }
};

