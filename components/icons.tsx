import React from 'react';
import { 
  Palette, Utensils, Camera, Heart, Code, Music, Dumbbell, Briefcase, Plane, Gamepad2, 
  ShoppingCart, Book, Car, Home, Leaf, Star, Crown, Diamond, Zap, Smile, Anchor, Wrench,
  Globe, Cpu, Smartphone, Rocket, Gift, Coffee, MapPin, Mic, Video
} from 'lucide-react';

export const ICON_MAP: Record<string, { component: React.ReactNode, path: string, label: string, category: string }> = {
  // CREATIVI
  'palette': { component: <Palette size={40} strokeWidth={2.5} />, label: 'Arte', category: 'Creativi', path: "M13.5 2h-9A4.5 4.5 0 0 0 0 6.5v9A4.5 4.5 0 0 0 4.5 20h9a4.5 4.5 0 0 0 4.5-4.5v-9A4.5 4.5 0 0 0 13.5 2zM7 16a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm7 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" },
  'camera': { component: <Camera size={40} strokeWidth={2.5} />, label: 'Foto', category: 'Creativi', path: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" },
  'music': { component: <Music size={40} strokeWidth={2.5} />, label: 'Musica', category: 'Creativi', path: "M9 18V5l12-2v13 M9 9l12-2 M9 19a3 3 0 1 1-3-3 3 3 0 0 1 3 3 M21 16a3 3 0 1 1-3-3 3 3 0 0 1 3 3" },
  'video': { component: <Video size={40} strokeWidth={2.5} />, label: 'Video', category: 'Creativi', path: "M23 7l-7 5 7 5V7z M14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" },
  'mic': { component: <Mic size={40} strokeWidth={2.5} />, label: 'Voce', category: 'Creativi', path: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v4 M8 23h8" },
  // BUSINESS
  'briefcase': { component: <Briefcase size={40} strokeWidth={2.5} />, label: 'Lavoro', category: 'Business', path: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16 M2 11h20 M2 11v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-9" },
  'code': { component: <Code size={40} strokeWidth={2.5} />, label: 'Dev', category: 'Business', path: "M16 18l6-6-6-6 M8 6l-6 6 6 6" },
  'globe': { component: <Globe size={40} strokeWidth={2.5} />, label: 'Web', category: 'Business', path: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z M2 12h20" },
  'cpu': { component: <Cpu size={40} strokeWidth={2.5} />, label: 'Tech', category: 'Business', path: "M5 9h14M5 15h14M9 5v14M15 5v14M4 4h16v16H4z" },
  'smartphone': { component: <Smartphone size={40} strokeWidth={2.5} />, label: 'App', category: 'Business', path: "M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M12 18h.01" },
  'rocket': { component: <Rocket size={40} strokeWidth={2.5} />, label: 'Startup', category: 'Business', path: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z M12 15l-3-3a22 22 0 0 1 2-9 20.66 20.66 0 0 1 10 10 22 22 0 0 1-9 2zM5 21l4-4" },
  // LIFESTYLE
  'heart': { component: <Heart size={40} strokeWidth={2.5} />, label: 'Salute', category: 'Lifestyle', path: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" },
  'dumbbell': { component: <Dumbbell size={40} strokeWidth={2.5} />, label: 'Gym', category: 'Lifestyle', path: "M6.5 6.5l11 11 M21 21l-1-1 M3 3l1 1 M18 22l4-4 M2 6l4-4 M3 10l7-7 M14 21l7-7" },
  'gamepad': { component: <Gamepad2 size={40} strokeWidth={2.5} />, label: 'Gaming', category: 'Lifestyle', path: "M6 11h4 M8 9v4 M15 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2 M18 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2 M2 12c0-4.4 3.6-8 8-8h4c4.4 0 8 3.6 8 8v1a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-1z" },
  'plane': { component: <Plane size={40} strokeWidth={2.5} />, label: 'Viaggi', category: 'Lifestyle', path: "M2 12h20 M13 12l3-7 M6 12l3 7" },
  'map-pin': { component: <MapPin size={40} strokeWidth={2.5} />, label: 'Luoghi', category: 'Lifestyle', path: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" },
  'car': { component: <Car size={40} strokeWidth={2.5} />, label: 'Auto', category: 'Lifestyle', path: "M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-1l-4.72-1.06a3 3 0 0 0-1.22-.32H7.78a3 3 0 0 0-1.22.32L1.84 11.85a1 1 0 0 0-.84 1V16h3m15 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-15 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" },
  // HOME
  'utensils': { component: <Utensils size={40} strokeWidth={2.5} />, label: 'Cibo', category: 'Home', path: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2 M7 2v20 M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" },
  'coffee': { component: <Coffee size={40} strokeWidth={2.5} />, label: 'Bar', category: 'Home', path: "M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" },
  'home': { component: <Home size={40} strokeWidth={2.5} />, label: 'Casa', category: 'Home', path: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
  'leaf': { component: <Leaf size={40} strokeWidth={2.5} />, label: 'Natura', category: 'Home', path: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 .5 3.5-.6 9.2A7 7 0 0 1 11 20ZM2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" },
  'shopping-cart': { component: <ShoppingCart size={40} strokeWidth={2.5} />, label: 'Shop', category: 'Home', path: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" },
  'gift': { component: <Gift size={40} strokeWidth={2.5} />, label: 'Regali', category: 'Home', path: "M20 12v10H4V12 M2 7h20v5H2z M12 22V7 M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" },
  // SIMBOLI
  'star': { component: <Star size={40} strokeWidth={2.5} />, label: 'Top', category: 'Simboli', path: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
  'crown': { component: <Crown size={40} strokeWidth={2.5} />, label: 'Re', category: 'Simboli', path: "m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" },
  'diamond': { component: <Diamond size={40} strokeWidth={2.5} />, label: 'Lusso', category: 'Simboli', path: "M6 3h12l4 6-10 13L2 9Z" },
  'zap': { component: <Zap size={40} strokeWidth={2.5} />, label: 'Power', category: 'Simboli', path: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
  'smile': { component: <Smile size={40} strokeWidth={2.5} />, label: 'Smile', category: 'Simboli', path: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" },
  'anchor': { component: <Anchor size={40} strokeWidth={2.5} />, label: 'Mare', category: 'Simboli', path: "M12 22V8 M5 12H2a10 10 0 0 0 20 0h-3 M12 5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" },
  'tools': { component: <Wrench size={40} strokeWidth={2.5} />, label: 'Tool', category: 'Simboli', path: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" }
};
