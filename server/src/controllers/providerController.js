import Provider from '../models/Provider.js';
import { scoreProvider } from '../utils/recommendation.js';

export const getProviders = async (req, res, next) => {
  try {
    const { service, urgent, lng, lat } = req.query;
    const filter = service ? { services: service } : {};
    if (urgent === 'true') filter.emergencyAvailable = true;

    const providers = await Provider.find(filter).populate('user', 'name avatar phone location').populate('services');
    const scored = providers
      .map((provider) => ({
        ...provider.toObject(),
        recommendationScore: scoreProvider(provider, {
          serviceId: service,
          urgent: urgent === 'true',
          coordinates: [Number(lng), Number(lat)]
        })
      }))
      .sort((a, b) => b.recommendationScore - a.recommendationScore);

    res.json({ success: true, providers: scored });
  } catch (error) {
    next(error);
  }
};

export const updateProviderProfile = async (req, res, next) => {
  try {
    const provider = await Provider.findOneAndUpdate({ user: req.user._id }, req.body, {
      new: true,
      runValidators: true
    }).populate('services');
    res.json({ success: true, provider });
  } catch (error) {
    next(error);
  }
};

export const verifyProvider = async (req, res, next) => {
  try {
    const provider = await Provider.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
    res.json({ success: true, provider });
  } catch (error) {
    next(error);
  }
};

