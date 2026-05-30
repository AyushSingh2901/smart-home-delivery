import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Service from '../models/Service.js';

dotenv.config();

const services = [
  { name: 'Plumbing Repair', slug: 'plumbing-repair', category: 'Plumber', icon: 'Wrench', description: 'Leak fixes, tap installation, pipe repairs and drainage support.', basePrice: 499 },
  { name: 'Electrical Fix', slug: 'electrical-fix', category: 'Electrician', icon: 'Zap', description: 'Switch boards, wiring, fan, light and appliance electrical support.', basePrice: 399 },
  { name: 'Carpentry Work', slug: 'carpentry-work', category: 'Carpenter', icon: 'Hammer', description: 'Furniture repair, fittings, modular setup and custom woodwork.', basePrice: 599 },
  { name: 'AC Repair', slug: 'ac-repair', category: 'AC Repair', icon: 'Snowflake', description: 'AC servicing, gas refill, diagnostics and installation.', basePrice: 799 },
  { name: 'Deep Cleaning', slug: 'deep-cleaning', category: 'Cleaning', icon: 'Sparkles', description: 'Bathroom, kitchen, sofa and full home cleaning services.', basePrice: 999 },
  { name: 'Wall Painting', slug: 'wall-painting', category: 'Painter', icon: 'Paintbrush', description: 'Interior, exterior, touch-up, waterproofing and texture painting.', basePrice: 1499 }
];

const run = async () => {
  await connectDB();

  const results = await Promise.all(
    services.map((service) =>
      Service.findOneAndUpdate({ slug: service.slug }, service, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      })
    )
  );

  console.log(`Service catalog ready: ${results.length} services available`);
  console.log('No users, providers, bookings, payments, reviews, notifications, or chats were created.');
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error.message);
  console.error('MongoDB is not running. Start it with `npm run mongo:start`, then run `npm run seed` again.');
  await mongoose.disconnect();
  process.exit(1);
});
