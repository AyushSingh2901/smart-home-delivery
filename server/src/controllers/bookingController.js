import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';
import Provider from '../models/Provider.js';
import Service from '../models/Service.js';

export const createBooking = async (req, res, next) => {
  try {
    const service = await Service.findById(req.body.service);
    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    const provider = req.body.provider ? await Provider.findById(req.body.provider) : null;
    const price =
      provider?.pricing?.find((item) => item.service.toString() === service._id.toString())?.price ||
      service.basePrice + (req.body.urgent ? 299 : 0);

    const booking = await Booking.create({
      ...req.body,
      customer: req.user._id,
      price,
      statusTimeline: [{ status: 'Pending', by: req.user._id }]
    });

    if (provider) {
      await Notification.create({
        user: provider.user,
        title: 'New booking request',
        message: `A customer requested ${service.name}`,
        type: 'booking',
        data: { booking: booking._id }
      });
      req.io?.to(`user:${provider.user}`).emit('booking:new', booking);
    }

    res.status(201).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'customer') filter.customer = req.user._id;
    if (req.user.role === 'provider') {
      const provider = await Provider.findOne({ user: req.user._id });
      filter.provider = provider?._id;
    }

    const bookings = await Booking.find(filter)
      .populate('customer', 'name phone email')
      .populate({ path: 'provider', populate: { path: 'user', select: 'name phone avatar' } })
      .populate('service')
      .sort('-createdAt');
    res.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('customer provider service');
    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    booking.status = req.body.status;
    booking.statusTimeline.push({ status: req.body.status, by: req.user._id });
    if (req.body.status === 'Completed') booking.paymentStatus = booking.paymentStatus === 'Paid' ? 'Paid' : 'Pending';
    await booking.save();

    await Notification.create({
      user: booking.customer,
      title: 'Booking updated',
      message: `Your booking is now ${booking.status}`,
      type: 'booking',
      data: { booking: booking._id }
    });

    req.io?.to(`booking:${booking._id}`).emit('booking:status', booking);
    req.io?.to(`user:${booking.customer}`).emit('notification:new', { title: 'Booking updated', status: booking.status });
    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

