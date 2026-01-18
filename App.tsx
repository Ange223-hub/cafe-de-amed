
import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Star, 
  Instagram, 
  Facebook, 
  Menu as MenuIcon, 
  X,
  Utensils,
  ShoppingBag,
  Send,
  Calendar,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Heart,
  Quote,
  Navigation,
  ExternalLink,
  Loader2,
  Sun,
  Moon
} from 'lucide-react';
import { MenuItem, CartItem } from './types';
import { GoogleGenAI } from "@google/genai";

const WHATSAPP_NUMBER = "22676832824";

const MENU_DATA: MenuItem[] = [
  { 
    id: '1', 
    category: 'Grillades', 
    name: 'Poulet Braisé Amed', 
    price: 4500, 
    priceString: '4,500 FCFA', 
    description: 'Poulet fermier mariné aux 12 épices, braisé lentement au bois de néré. Servi avec alloco.', 
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: '2', 
    category: 'Grillades', 
    name: 'Le Capitaine Royal', 
    price: 3500, 
    priceString: '3,500 FCFA', 
    description: 'Pavé de capitaine sauvage grillé unilatéralement, sauce vierge au citron de Bobo.', 
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: '3', 
    category: 'Burgers', 
    name: 'Le Big Nonsin', 
    price: 3000, 
    priceString: '3,000 FCFA', 
    description: 'Double steak de bœuf, cheddar fondant, oignons caramélisés et notre sauce secrète.', 
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: '4', 
    category: 'Pizzas', 
    name: 'Pizza Amed Spéciale', 
    price: 5000, 
    priceString: '5,000 FCFA', 
    description: 'Mélange de viandes braisées, poivrons frais, mozzarella et origan sauvage.', 
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800' 
  },
];

const REVIEWS = [
  { name: "Moussa Traoré", comment: "Le meilleur poulet braisé de tout Ouaga. Service impeccable même à 3h du matin !", rating: 5 },
  { name: "Alice Durand", comment: "Une pépite à Nonsin. Le cadre est magnifique et la carte est très variée.", rating: 5 },
];

const LocationFinder = () => {
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState<{ text: string, links: any[] } | null>(null);

  const findRestaurant = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let lat = 12.3714; 
      let lng = -1.5197;
      
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch (e) { console.log("Geolocation denied"); }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Où se trouve précisément le Cafe Resto Amed à Ouagadougou ? Indique qu'il est à Nonsin et comment y accéder.",
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: { latLng: { latitude: lat, longitude: lng } }
          }
        },
      });

      const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      setLocationData({ text: response.text || "Le restaurant est situé au quartier Nonsin, Ouagadougou.", links });
    } catch (error) {
      setLocationData({ 
        text: "Le Cafe Resto Amed vous accueille 24h/24 au quartier Nonsin, à proximité de la Rue 19.30 à Ouagadougou.", 
        links: [{ maps: { uri: "https://www.google.com/maps/search/Cafe+Resto+Amed+Ouagadougou", title: "Ouvrir Google Maps" } }] 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-themed rounded-[3rem] p-10 lg:p-16 space-y-10">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-amber-600 flex items-center justify-center rounded-2xl shadow-lg shadow-amber-600/30">
          <MapPin className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-3xl font-black tracking-tighter dark:text-white">Nous Trouver</h3>
          <p className="text-stone-500 dark:text-stone-400 text-sm">Quartier Nonsin, Ouaga</p>
        </div>
      </div>

      <div className="min-h-[100px] flex flex-col justify-center">
        {loading ? (
          <div className="flex items-center gap-4 text-amber-600 animate-pulse">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="font-bold tracking-widest text-xs uppercase">Localisation en cours...</span>
          </div>
        ) : locationData ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <p className="text-stone-600 dark:text-stone-300 leading-relaxed italic">"{locationData.text}"</p>
            <div className="flex flex-wrap gap-4">
              {locationData.links.map((link: any, i: number) => link.maps && (
                <a 
                  key={i} 
                  href={link.maps.uri} 
                  target="_blank" 
                  className="inline-flex items-center gap-2 bg-stone-100 dark:bg-white/10 hover:bg-amber-600 hover:text-white text-stone-900 dark:text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  <ExternalLink className="w-4 h-4" /> {link.maps.title || "Itinéraire"}
                </a>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-stone-400 text-sm">Appuyez pour obtenir l'itinéraire précis vers notre restaurant.</p>
        )}
      </div>

      <button 
        onClick={findRestaurant}
        disabled={loading}
        className="w-full bg-stone-900 dark:bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-500 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all flex items-center justify-center gap-4 shadow-xl"
      >
        <Navigation className="w-5 h-5" /> Obtenir l'itinéraire
      </button>
    </div>
  );
};

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    
    // Theme initialization
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen transition-colors duration-500">
      <div className="fixed inset-0 grainy-bg pointer-events-none z-[90]"></div>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-700 px-6 py-4 lg:px-12 ${scrolled ? 'glass-nav py-4' : 'bg-transparent py-8 text-white'}`}>
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-amber-600 p-3 rounded-xl shadow-lg shadow-amber-600/30">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className={`text-2xl font-black tracking-tighter ${scrolled ? 'text-stone-900 dark:text-white' : 'text-white'}`}>AMED</span>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-amber-500">Cafe Resto</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-12">
            {['accueil', 'menu', 'reservation', 'contact'].map(link => (
              <a key={link} href={`#${link}`} className={`text-[10px] font-black uppercase tracking-[0.5em] transition-all hover:text-amber-500 ${scrolled ? 'text-stone-500 dark:text-white/60' : 'text-white/80'}`}>{link}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className={`p-4 rounded-xl transition-all border ${scrolled ? 'border-stone-200 dark:border-white/10 text-stone-900 dark:text-white hover:bg-stone-100 dark:hover:bg-white/5' : 'border-white/20 text-white hover:bg-white/10'}`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setIsCartOpen(true)} 
              className={`relative p-4 rounded-xl transition-all border ${scrolled ? 'bg-stone-900 dark:bg-amber-600 text-white border-transparent' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-amber-600 dark:bg-white dark:text-stone-900 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-stone-50 dark:border-stone-950">{cart.length}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="accueil" className="relative min-h-screen flex items-center pt-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover brightness-[0.4] lg:brightness-[0.6]" 
            alt="Hero" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/40 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full text-white">
          <div className="max-w-4xl space-y-12">
            <span className="inline-block bg-amber-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em]">Ouvert 24h/24 • 7j/7</span>
            <h1 className="text-6xl md:text-[9rem] font-black leading-[0.85] tracking-tight">
              L'Authentique <br/> 
              <span className="text-amber-500 font-title italic font-medium">Saveur.</span>
            </h1>
            <p className="text-xl md:text-2xl text-stone-300 font-light leading-relaxed max-w-2xl">
              Découvrez le goût unique de nos grillades au feu de bois dans un cadre moderne et accueillant au cœur de Ouagadougou.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 pt-4">
              <a href="#menu" className="btn-primary flex items-center justify-center gap-4">Découvrir le Menu <ArrowRight className="w-5 h-5" /></a>
              <a href="#reservation" className="flex items-center justify-center gap-4 text-white font-black uppercase text-[10px] tracking-[0.4em] border border-white/20 px-8 py-4 rounded-2xl hover:bg-white/10 transition-all">
                Réserver une table
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Location */}
      <section className="py-32 bg-stone-50 dark:bg-stone-950 transition-colors">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <span className="text-amber-600 font-black uppercase tracking-[0.5em] text-[10px]">Notre Signature</span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none dark:text-white">
                Qualité, Fraîcheur <br/> & <span className="text-amber-600">Passion.</span>
              </h2>
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-lg leading-relaxed">
              Plus qu'un restaurant, le Cafe Resto Amed est une institution à Nonsin. Nous cuisinons avec amour pour vous offrir une expérience mémorable à chaque bouchée.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="p-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-white/5">
                <span className="text-amber-600 font-black text-4xl mb-2 block">100%</span>
                <p className="text-stone-400 text-[10px] uppercase font-black tracking-widest">Produits Locaux</p>
              </div>
              <div className="p-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-white/5">
                <span className="text-amber-600 font-black text-4xl mb-2 block">24/7</span>
                <p className="text-stone-400 text-[10px] uppercase font-black tracking-widest">Disponibilité</p>
              </div>
            </div>
          </div>
          <LocationFinder />
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-32 bg-white dark:bg-stone-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 space-y-4">
             <span className="text-amber-600 font-black uppercase tracking-[0.5em] text-[10px]">Gastronomie Urbaine</span>
             <h2 className="text-6xl md:text-8xl font-black tracking-tighter dark:text-white">Notre Carte</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {MENU_DATA.map((item) => (
              <div key={item.id} className="group relative bg-stone-50 dark:bg-stone-950 p-8 rounded-[3rem] flex flex-col md:flex-row gap-10 items-center border border-transparent hover:border-amber-600/30 transition-all">
                <div className="w-full md:w-56 h-56 flex-shrink-0 overflow-hidden rounded-[2rem] shadow-xl">
                  <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.name} />
                </div>
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="flex flex-col md:flex-row justify-between items-center md:items-end border-b border-stone-200 dark:border-white/10 pb-4 gap-4">
                    <h4 className="text-2xl font-black tracking-tight dark:text-white">{item.name}</h4>
                    <span className="text-amber-600 font-black text-xl">{item.priceString}</span>
                  </div>
                  <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">{item.description}</p>
                  <button 
                    onClick={() => addToCart(item)}
                    className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-amber-600 dark:hover:bg-amber-600 hover:text-white transition-all shadow-lg"
                  >
                    Ajouter au Panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-amber-600 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-16">
          <Quote className="w-20 h-20 text-white/20 mx-auto" />
          <h2 className="text-4xl md:text-6xl font-title italic font-medium leading-tight">
            "Une adresse incontournable. Le poulet braisé est tout simplement le meilleur de la ville. L'ambiance y est toujours excellente."
          </h2>
          <div className="flex items-center justify-center gap-6">
            <div className="w-14 h-14 bg-white text-amber-600 rounded-full flex items-center justify-center font-black shadow-xl">AD</div>
            <div className="text-left">
              <p className="font-black uppercase tracking-widest text-sm">Alice Durand</p>
              <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Guide Gourmet</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-24 bg-stone-900 dark:bg-black text-white transition-colors">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-16 text-center md:text-left">
          <div className="space-y-8">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="bg-amber-600 p-2 rounded-lg shadow-lg"><Utensils className="w-6 h-6 text-white" /></div>
              <span className="text-3xl font-black tracking-tighter">AMED RESTO</span>
            </div>
            <p className="text-stone-400 text-sm max-w-sm leading-relaxed">
              Rejoignez-nous au quartier Nonsin pour une expérience culinaire inoubliable. Service non-stop 24h/24.
            </p>
            <div className="flex gap-6 justify-center md:justify-start">
              <Instagram className="w-6 h-6 hover:text-amber-500 transition-colors cursor-pointer" />
              <Facebook className="w-6 h-6 hover:text-amber-500 transition-colors cursor-pointer" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            <div className="space-y-3">
              <p className="text-amber-500 font-black uppercase tracking-widest text-[10px]">Réservation</p>
              <p className="text-white text-2xl font-black">+226 76 83 28 24</p>
            </div>
            <div className="space-y-3">
              <p className="text-amber-500 font-black uppercase tracking-widest text-[10px]">Emplacement</p>
              <p className="text-white text-lg font-bold">Quartier Nonsin, Ouaga</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-16 mt-16 border-t border-white/5 text-center text-[10px] font-black uppercase tracking-[0.4em] text-stone-500">
          © 2024 Cafe Resto Amed • L'excellence à chaque bouchée.
        </div>
      </footer>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end">
          <div className="absolute inset-0 bg-stone-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative bg-white dark:bg-stone-900 text-stone-900 dark:text-white w-full max-w-lg h-full shadow-2xl p-10 flex flex-col animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-4xl font-black tracking-tighter flex items-center gap-4">
                <ShoppingBag className="w-8 h-8 text-amber-600" /> Panier
              </h3>
              <button onClick={() => setIsCartOpen(false)} className="p-4 hover:bg-stone-100 dark:hover:bg-white/5 rounded-full"><X className="w-8 h-8" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-8 pr-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                  <ShoppingBag className="w-24 h-24" />
                  <p className="text-xl font-bold uppercase tracking-widest">Votre panier est vide</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-6 items-center bg-stone-50 dark:bg-stone-950 p-6 rounded-3xl border border-stone-100 dark:border-white/5">
                    <img src={item.image} className="w-20 h-20 rounded-2xl object-cover shadow-lg" alt={item.name} />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">{item.name}</h4>
                      <p className="text-amber-600 font-black text-sm">{item.priceString}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs font-bold text-stone-400">Quantité: {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-8 space-y-8">
                <div className="flex justify-between items-end border-t border-stone-100 dark:border-white/10 pt-8">
                  <span className="text-stone-400 font-black uppercase tracking-widest text-xs">Total</span>
                  <span className="text-4xl font-black tracking-tighter text-amber-600">
                    {cart.reduce((s, i) => s + (i.price * i.quantity), 0).toLocaleString()} FCFA
                  </span>
                </div>
                <button 
                  onClick={() => {
                    const message = `Bonjour Amed Resto ! Je souhaite commander : ${cart.map(i => `${i.quantity}x ${i.name}`).join(', ')}`;
                    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-8 rounded-3xl font-black uppercase tracking-[0.4em] text-xs shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4"
                >
                  Commander via WhatsApp <Send className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
