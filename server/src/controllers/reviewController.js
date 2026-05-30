import Provider from '../models/Provider.js';
import Review from '../models/Review.js';

export const createReview = async (req, res, next) => {
  try {
    const review = await Review.create({ ...req.body, customer: req.user._id });
    const reviews = await Review.find({ provider: review.provider });
    const average = reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;
    await Provider.findByIdAndUpdate(review.provider, {
      rating: { average: Number(average.toFixed(1)), count: reviews.length }
    });
    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

export const getProviderReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ provider: req.params.providerId }).populate('customer', 'name avatar').sort('-createdAt');
    res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

