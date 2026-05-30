import ChatMessage from '../models/ChatMessage.js';

export const getMessages = async (req, res, next) => {
  try {
    const messages = await ChatMessage.find({ booking: req.params.bookingId }).populate('sender receiver', 'name avatar').sort('createdAt');
    res.json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const message = await ChatMessage.create({
      booking: req.params.bookingId,
      sender: req.user._id,
      receiver: req.body.receiver,
      message: req.body.message
    });
    req.io?.to(`booking:${req.params.bookingId}`).emit('chat:message', message);
    res.status(201).json({ success: true, message });
  } catch (error) {
    next(error);
  }
};

