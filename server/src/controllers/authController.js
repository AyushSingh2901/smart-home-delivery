import User from '../models/User.js';
import Provider from '../models/Provider.js';
import Service from '../models/Service.js';
import { signToken } from '../utils/tokens.js';

const sendAuth = (res, user, statusCode = 200) => {
  const token = signToken(user);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      language: user.language
    }
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role = 'customer', providerProfile } = req.body;
    let providerServices = [];

    if (role === 'provider') {
      const selectedServices = providerProfile?.services || [];
      if (!selectedServices.length) {
        res.status(400);
        throw new Error('Please select at least one service you provide');
      }

      providerServices = await Service.find({ _id: { $in: selectedServices }, active: true });
      if (providerServices.length !== selectedServices.length) {
        res.status(400);
        throw new Error('One or more selected services are invalid');
      }
    }

    const user = await User.create({ name, email, password, phone, role });

    if (role === 'provider') {
      await Provider.create({
        user: user._id,
        headline: providerProfile?.headline || 'Trusted home service expert',
        services: providerServices.map((service) => service._id),
        skills: providerProfile?.skills?.length ? providerProfile.skills : providerServices.map((service) => service.category),
        pricing: providerServices.map((service) => ({
          service: service._id,
          price: providerProfile?.pricing?.[service._id.toString()] || service.basePrice
        })),
        emergencyAvailable: Boolean(providerProfile?.emergencyAvailable)
      });
    }

    sendAuth(res, user, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }
    sendAuth(res, user);
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res) => {
  const provider = req.user.role === 'provider' ? await Provider.findOne({ user: req.user._id }).populate('services') : null;
  res.json({ success: true, user: req.user, provider });
};
