import { Hammer, Paintbrush, ShieldCheck, Snowflake, Sparkles, Wrench, Zap } from 'lucide-react';

export const iconMap = { Wrench, Zap, Hammer, Snowflake, Sparkles, Paintbrush };

export const dashboardStats = [
  { label: 'Verified Experts', value: '2,400+', icon: ShieldCheck },
  { label: 'Bookings Completed', value: '58k+', icon: Sparkles },
  { label: 'Avg. Arrival', value: '34 min', icon: Zap }
];

export const translations = {
  en: { bookNow: 'Book Now', urgent: 'Need service urgently', trusted: 'Trusted local professionals' },
  hi: { bookNow: 'बुक करें', urgent: 'तुरंत सेवा चाहिए', trusted: 'भरोसेमंद स्थानीय विशेषज्ञ' },
  mr: { bookNow: 'बुक करा', urgent: 'तातडीची सेवा हवी', trusted: 'विश्वसनीय स्थानिक तज्ञ' },
  ta: { bookNow: 'பதிவு செய்க', urgent: 'அவசர சேவை தேவை', trusted: 'நம்பகமான உள்ளூர் நிபுணர்கள்' }
};
