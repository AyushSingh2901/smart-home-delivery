import Service from '../models/Service.js';

export const getServices = async (req, res, next) => {
  try {
    const query = req.query.category ? { category: req.query.category, active: true } : { active: true };
    const services = await Service.find(query).sort('category name');
    res.json({ success: true, services });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, service });
  } catch (error) {
    next(error);
  }
};

