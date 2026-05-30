import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import Provider from '../models/Provider.js';
import Service from '../models/Service.js';
import User from '../models/User.js';

export const getAnalytics = async (req, res, next) => {
  try {
    const [users, providers, bookings, payments, services] = await Promise.all([
      User.countDocuments(),
      Provider.countDocuments(),
      Booking.find().populate('service'),
      Payment.find({ status: 'paid' }),
      Service.find()
    ]);

    const revenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const bookingTrends = ['Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled'].map((status) => ({
      status,
      count: bookings.filter((booking) => booking.status === status).length
    }));
    const popularServices = services.map((service) => ({
      name: service.name,
      bookings: bookings.filter((booking) => booking.service?._id?.toString() === service._id.toString()).length
    }));

    res.json({ success: true, analytics: { users, providers, bookings: bookings.length, revenue, bookingTrends, popularServices } });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

export const getAdminProviders = async (req, res, next) => {
  try {
    const providers = await Provider.find().populate('user', 'name email phone avatar isActive').populate('services').sort('-createdAt');
    res.json({ success: true, providers });
  } catch (error) {
    next(error);
  }
};

export const getAdminPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate('customer', 'name email')
      .populate({ path: 'provider', populate: { path: 'user', select: 'name email' } })
      .populate('booking')
      .sort('-createdAt');
    res.json({ success: true, payments });
  } catch (error) {
    next(error);
  }
};

export const deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
