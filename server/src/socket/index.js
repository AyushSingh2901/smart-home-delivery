import jwt from 'jsonwebtoken';

export const configureSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next();
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      socket.user = null;
    }
    next();
  });

  io.on('connection', (socket) => {
    if (socket.user?.id) socket.join(`user:${socket.user.id}`);

    socket.on('booking:join', (bookingId) => socket.join(`booking:${bookingId}`));
    socket.on('booking:leave', (bookingId) => socket.leave(`booking:${bookingId}`));

    socket.on('provider:location', ({ bookingId, coordinates }) => {
      socket.to(`booking:${bookingId}`).emit('provider:location', { bookingId, coordinates, at: new Date() });
    });

    socket.on('typing', ({ bookingId, user }) => {
      socket.to(`booking:${bookingId}`).emit('typing', { bookingId, user });
    });
  });
};

