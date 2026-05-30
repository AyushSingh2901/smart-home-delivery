import { Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { endpoints } from '../services/api';

export default function Chat() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [params] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [bookingId, setBookingId] = useState(params.get('booking') || '');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    endpoints.bookings().then(({ data }) => {
      setBookings(data.bookings);
      if (!bookingId && data.bookings[0]?._id) setBookingId(data.bookings[0]._id);
    }).catch(() => setBookings([]));
  }, []);

  useEffect(() => {
    if (!bookingId) return;
    endpoints.messages(bookingId).then(({ data }) => setMessages(data.messages)).catch(() => setMessages([]));
  }, [bookingId]);

  useEffect(() => {
    if (!socket || !bookingId) return undefined;
    socket.emit('booking:join', bookingId);
    socket.on('chat:message', (message) => setMessages((current) => [...current, message]));
    socket.on('provider:location', () => toast.success('Provider location updated'));
    return () => {
      socket.emit('booking:leave', bookingId);
      socket.off('chat:message');
    };
  }, [socket, bookingId]);

  const selectedBooking = bookings.find((booking) => booking._id === bookingId);
  const receiver =
    user?.role === 'customer'
      ? selectedBooking?.provider?.user?._id || selectedBooking?.provider?.user
      : selectedBooking?.customer?._id || selectedBooking?.customer;

  const submit = async (event) => {
    event.preventDefault();
    if (!text.trim() || !bookingId || !receiver) return;
    try {
      const { data } = await endpoints.sendMessage(bookingId, { receiver, message: text });
      if (!socket) setMessages((current) => [...current, data.message]);
      socket?.emit('typing', { bookingId, user: user?.name });
      setText('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Message not sent');
    }
  };

  return (
    <DashboardShell title="Chat" subtitle="Real-time customer and provider conversation.">
      <div className="card flex min-h-[560px] flex-col p-5">
        {!bookings.length ? <EmptyState title="No bookings available for chat" message="Chat messages are stored in MongoDB and require a real booking." /> : (
          <>
            <select className="input mb-4" value={bookingId} onChange={(event) => setBookingId(event.target.value)}>
              {bookings.map((booking) => <option key={booking._id} value={booking._id}>{booking.service?.name || 'Booking'} - {booking.status}</option>)}
            </select>
            <div className="flex-1 space-y-3 overflow-y-auto">
              {messages.length ? messages.map((message, index) => {
                const senderId = message.sender?._id || message.sender;
                const isMine = senderId === user?.id || senderId === user?._id;
                return (
                  <div key={message._id || `${message.message}-${index}`} className={`max-w-[82%] rounded-lg px-4 py-3 ${isMine ? 'ml-auto bg-brand text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100'}`}>
                    <p className="text-xs font-bold opacity-70">{message.sender?.name || (isMine ? user?.name : 'User')}</p>
                    <p className="mt-1">{message.message}</p>
                  </div>
                );
              }) : <EmptyState title="No messages yet" message="Start the conversation for this MongoDB booking." />}
            </div>
            <form onSubmit={submit} className="mt-4 flex gap-3">
              <input className="input" placeholder={receiver ? 'Type a message' : 'Assign a provider before chatting'} value={text} onChange={(e) => setText(e.target.value)} disabled={!receiver} />
              <button className="btn-primary px-4" aria-label="Send" disabled={!receiver}><Send size={18} /></button>
            </form>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
