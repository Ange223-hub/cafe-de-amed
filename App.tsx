
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
  Moon,
  MessageCircle,
  Camera,
  CheckCircle2,
  Ticket as TicketIcon,
  Car,
  Timer,
  Settings,
  Edit2,
  Save,
  PlusCircle,
  Image as ImageIcon,
  LogOut,
  Map as MapIcon
} from 'lucide-react';
import { MenuItem, CartItem } from './types';
import { OrderButton } from './src/OrderButton';
import { useOrderFlow } from './src/useOrderFlow';
import { OrderCompleteData, TicketData } from './types/order';
import { OrderOptionsModal } from './src/OrderOptionsModal';

// Déclaration pour TypeScript
declare global {
  interface Window {
    handleQuickOrder?: () => void;
    cart?: CartItem[];
  }
}

const WHATSAPP_NUMBER = "22667609493";
const OWNER_NUMBER = "22666798031"; // Votre numéro pour recevoir les commissions
const COMMISSION_RATE = 10; // Commission fixe de 10 FCFA
const ORANGE_MONEY_PREFIX = "*144*10*67609493*"; // Format Orange Money
const ADMIN_PHONE = "67609493";

// Système de suivi des commissions
const COMMISSION_STORAGE_KEY = 'amed_commissions';

const MENU_DATA: MenuItem[] = [
  // Plats principaux
  {
    id: '1',
    category: 'Plats',
    name: 'Poulet',
    price: 3500,
    priceString: '3,500 FCFA',
    description: 'Poulet frais grillé au feu de bois.',
    image: 'https://images.unsplash.com/photo-1626647839440-21da7199c3ae?auto=format&fit=crop&q=80&w=800',
    popular: true,
    prepTime: 20
  },
  {
    id: '2',
    category: 'Plats',
    name: 'Poisson',
    price: 2000,
    priceString: '2,000 FCFA',
    description: 'Poisson frais grillé.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
    prepTime: 15
  },
  {
    id: '3',
    category: 'Plats',
    name: 'Poisson Premium',
    price: 2500,
    priceString: '2,500 FCFA',
    description: 'Grande portion de poisson grillé.',
    image: 'https://images.unsplash.com/photo-1546833369-543b020c4b9c?auto=format&fit=crop&q=80&w=800',
    prepTime: 15
  },
  {
    id: '4',
    category: 'Plats',
    name: 'Poisson Royal',
    price: 3000,
    priceString: '3,000 FCFA',
    description: 'Poisson de choix avec sauce spéciale.',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=800',
    prepTime: 20
  },

  // Sandwichs et Fast Food
  {
    id: '5',
    category: 'Sandwichs',
    name: 'Poulet Pané Frite',
    price: 1500,
    priceString: '1,500 FCFA',
    description: 'Poulet pané croustillant avec frites.',
    image: 'https://images.unsplash.com/photo-1562967916-eb2a5429a186?auto=format&fit=crop&q=80&w=800',
    prepTime: 10
  },
  {
    id: '6',
    category: 'Sandwichs',
    name: 'Chawarma',
    price: 1500,
    priceString: '1,500 FCFA',
    description: 'Chawarma traditionnel.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
    prepTime: 10
  },
  {
    id: '7',
    category: 'Sandwichs',
    name: 'Sandwich',
    price: 1000,
    priceString: '1,000 FCFA',
    description: 'Sandwich classique.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=800',
    prepTime: 5
  },

  // Panini
  {
    id: '8',
    category: 'Sandwichs',
    name: 'Panini',
    price: 700,
    priceString: '700 FCFA',
    description: 'Panini option 700.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=800',
    prepTime: 5
  },
  {
    id: '9',
    category: 'Sandwichs',
    name: 'Panini',
    price: 800,
    priceString: '800 FCFA',
    description: 'Panini option 800.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=800',
    prepTime: 5
  },
  {
    id: '10',
    category: 'Sandwichs',
    name: 'Panini',
    price: 1000,
    priceString: '1,000 FCFA',
    description: 'Panini option 1000.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=800',
    prepTime: 5
  },

  // Accompagnements
  {
    id: '11',
    category: 'Accompagnements',
    name: 'Frite',
    price: 500,
    priceString: '500 FCFA',
    description: 'Frites maison.',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3a1b8e7?auto=format&fit=crop&q=80&w=800',
    prepTime: 5
  },
  {
    id: '12',
    category: 'Accompagnements',
    name: 'Salade',
    price: 1000,
    priceString: '1,000 FCFA',
    description: 'Salade fraîche.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    prepTime: 5
  },
  {
    id: '13',
    category: 'Accompagnements',
    name: 'Riz',
    price: 500,
    priceString: '500 FCFA',
    description: 'Riz blanc.',
    image: 'https://images.unsplash.com/photo-1536304993881-ff1e65d4223f?auto=format&fit=crop&q=80&w=800',
    prepTime: 5
  }
];

const REVIEWS = [
  { name: "Moussa Traoré", comment: "Le meilleur poulet braisé de tout Ouaga. Service impeccable même à 3h du matin !", rating: 5 },
  { name: "Alice Durand", comment: "Une pépite à Nonsin. Le cadre est magnifique et la carte est très variée.", rating: 5 },
];

const LocationFinder = () => {
  const openMaps = () => {
    const mapsUrl = "https://www.google.com/maps/search/Cafe+Resto+Amed+Ouagadougou+Nonsin";
    window.open(mapsUrl, '_blank');
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed italic">
            "Le Cafe Resto Amed vous accueille 24h/24 au quartier Nonsin, à proximité de la Rue 19.30 à Ouagadougou. Un cadre chaleureux pour vos repas à toute heure."
          </p>
        </div>
      </div>

      <button
        onClick={openMaps}
        className="w-full bg-stone-900 dark:bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-500 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all flex items-center justify-center gap-4 shadow-xl"
      >
        <Navigation className="w-5 h-5" /> Ouvrir sur Google Maps
      </button>
    </div>
  );
};

const OrderModal = ({ isOpen, onClose, cart, onComplete }: { isOpen: boolean, onClose: () => void, cart: CartItem[], onComplete: (orderData: OrderCompleteData) => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', phone: '', eta: '15-20 min', address: '', mode: '1', location: null as { lat: number; lng: number } | null });
  const [isLocating, setIsLocating] = useState(false);
  const [paymentImage, setPaymentImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
  const commission = 10; // Commission fixe de 10 FCFA
  const deliveryFee = formData.mode === '2' ? 500 : 0;
  const grandTotal = total + commission + deliveryFee;

  const handleGetLocation = async () => {
    setIsLocating(true);
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
      setFormData(prev => ({
        ...prev,
        location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        address: prev.address || "Position GPS détectée"
      }));
    } catch (e) {
      alert("Erreur de localisation. Veuillez entrer l'adresse manuellement.");
    } finally {
      setIsLocating(false);
    }
  };

  const handleFinish = () => {
    try {
      const orderId = 'AMED-' + Math.random().toString(36).substr(2, 9).toUpperCase();

      if ((window as any).commissionSystem) {
        try {
          const orderType = formData.mode === '1' ? '🚗 EN ROUTE' : formData.mode === '2' ? '🏠 LIVRAISON' : '🍽️ SUR PLACE';
          (window as any).commissionSystem.addCommission(commission, orderType, formData.name, formData.phone);
        } catch (commError) {
          // Silencieux pour ne pas bloquer l'expérience utilisateur
        }
      }

      onComplete({ 
        ...formData, 
        orderId, 
        total: grandTotal, 
        items: cart, 
        cart, // Ajout pour compatibilité
        commission,
        grandTotal,
        paymentSnapshot: paymentImage || undefined,
        location: formData.location || undefined
      });
      onClose();
    } catch (error) {
      alert("Une erreur est survenue lors de la validation. Veuillez réessayer ou contacter le restaurant directement.");
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-stone-900/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-stone-900 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 md:p-12 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-3xl font-black tracking-tighter dark:text-white uppercase">
              {step === 1 && "1. Options d'Arrivée"}
              {step === 2 && "2. Paiement & Validation"}
              {step === 3 && "3. Confirmation"}
            </h3>
            <button onClick={onClose} className="p-3 hover:bg-stone-100 dark:hover:bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
          </div>

          {step === 1 && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: '1', label: 'En Route', icon: <Car className="w-5 h-5" /> },
                  { id: '2', label: 'Livraison', icon: <MapPin className="w-5 h-5" /> },
                  { id: '3', label: 'Sur Place', icon: <Utensils className="w-5 h-5" /> }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setFormData({ ...formData, mode: m.id })}
                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${formData.mode === m.id ? 'border-amber-600 bg-amber-50 dark:bg-amber-600/10 text-amber-600' : 'border-stone-100 dark:border-white/5 hover:border-amber-600/30'}`}
                  >
                    {m.icon}
                    <span className="font-black uppercase text-sm tracking-wide">{m.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Votre Nom"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-stone-950 border-none p-6 rounded-2xl font-bold focus:ring-2 ring-amber-600 outline-none"
                />
                <input
                  type="tel"
                  placeholder="Téléphone WhatsApp"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-stone-950 border-none p-6 rounded-2xl font-bold focus:ring-2 ring-amber-600 outline-none"
                />
                {formData.mode === '2' && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Adresse de livraison"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        className="flex-1 bg-stone-50 dark:bg-stone-950 border-none p-6 rounded-2xl font-bold focus:ring-2 ring-amber-600 outline-none"
                      />
                      <button
                        onClick={handleGetLocation}
                        disabled={isLocating}
                        className={`px-6 rounded-2xl border-2 transition-all flex items-center justify-center ${formData.location ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-stone-100 dark:border-white/5 hover:border-amber-600'}`}
                      >
                        {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                      </button>
                    </div>
                    {formData.location && (
                      <p className="text-xs font-black uppercase tracking-wide text-green-600 px-4">Localisation GPS activée ✓</p>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.phone || (formData.mode === '2' && !formData.address)}
                className="w-full bg-amber-600 text-white py-6 rounded-2xl font-black uppercase tracking-wide text-sm shadow-xl shadow-amber-600/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {!formData.name || !formData.phone ? "Entrez vos coordonnées" : (formData.mode === '2' && !formData.address) ? "Entrez l'adresse de livraison" : "Continuer vers le paiement"}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="p-8 bg-amber-50 dark:bg-amber-600/10 rounded-3xl border border-amber-200 dark:border-amber-600/20 space-y-6 text-center">
                <p className="text-lg font-bold text-amber-900 dark:text-amber-100">Veuillez payer <span className="text-3xl font-black">{grandTotal.toLocaleString()} FCFA</span> via Orange Money</p>
                <div className="p-6 bg-white dark:bg-stone-900 rounded-xl font-black text-2xl tracking-widest border border-amber-200">
                  *144*10*67609493#
                </div>
                <button
                  onClick={() => window.location.href = `tel:*144*10*67609493*${grandTotal}#`}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-2xl font-black text-lg uppercase tracking-wider transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                  <Phone className="w-6 h-6" />
                  LANCER ORANGE MONEY
                </button>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Cliquez pour ouvrir automatiquement l'application téléphone
                </p>
              </div>

              {/* Demander la capture seulement si ce n'est pas "payer sur place" */}
              {formData.mode !== '3' && (
                <div className="space-y-4">
                  <p className="text-sm font-black uppercase tracking-wide text-stone-400 text-center">Capture d'écran du transfert</p>
                  <div
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="w-full aspect-video border-2 border-dashed border-stone-200 dark:border-white/10 rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-amber-600 transition-all overflow-hidden relative"
                  >
                    {paymentImage ? (
                      <img src={paymentImage} className="w-full h-full object-cover" alt="Capture" />
                    ) : (
                      <>
                        <Camera className="w-12 h-12 text-stone-300" />
                        <span className="text-sm font-bold text-stone-400 uppercase tracking-wide">Appuyez pour ajouter</span>
                      </>
                    )}
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (re) => setPaymentImage(re.target?.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-6 rounded-2xl font-black uppercase tracking-wide text-sm border border-stone-200 dark:border-white/10">Retour</button>
                <button
                  onClick={handleFinish}
                  disabled={formData.mode !== '3' && !paymentImage}
                  className="flex-[2] bg-green-600 text-white py-6 rounded-2xl font-black uppercase tracking-wide text-sm shadow-xl shadow-green-600/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  Valider la commande
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TicketModal = ({ ticket, onClose }: { ticket: TicketData, onClose: () => void }) => {
  if (!ticket) return null;

  const total = ticket.items.reduce((s: number, i: CartItem) => s + (i.price * i.quantity), 0);
  const commission = 10; // Commission fixe de 10 FCFA
  const deliveryFee = ticket.mode === '2' ? 500 : 0;
  const grandTotal = total + commission + deliveryFee;

  const handleWhatsApp = () => {
    const orderType = ticket.mode === '1' ? '🚗 EN ROUTE' : ticket.mode === '2' ? '🏠 LIVRAISON' : '🍽️ SUR PLACE';
    const gpsLink = ticket.location ? `\n📍 Position GPS: https://www.google.com/maps?q=${ticket.location.lat},${ticket.location.lng}` : '';
    const message = `⚡ *COMMANDE VALIDÉE* ⚡\n\n🆔 TICKET: ${ticket.orderId}\n\n${orderType}\n👤 Client: ${ticket.name}\n📞 Tel: ${ticket.phone}${ticket.address ? '\n📍 ' + ticket.address : ''}${gpsLink}\n\n🛒 Commande:\n${ticket.items.map((i: CartItem) => '• ' + i.quantity + 'x ' + i.name).join('\n')}\n\n💰 TOTAL: ${grandTotal.toLocaleString()} FCFA\n⏰ ARRIVÉE: ${ticket.eta}\n\n✅ Paiement Orange Money effectué.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-stone-900/95 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-stone-900 w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-12 duration-500">
        <div className="bg-amber-600 p-8 text-white text-center space-y-2">
          <TicketIcon className="w-12 h-12 mx-auto mb-4" />
          <h4 className="text-sm font-black uppercase tracking-wide">Votre Ticket de Commande</h4>
          <p className="text-4xl font-black tracking-tighter">{ticket.orderId}</p>
        </div>
        <div className="p-8 md:p-10 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 dark:border-white/5 pb-4">
              <span className="text-sm font-black uppercase tracking-wide text-stone-400">Statut</span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-600/20 text-green-600 text-sm font-black rounded-full uppercase tracking-wide">Validé</span>
            </div>
            <div className="flex justify-between items-center border-b border-stone-100 dark:border-white/5 pb-4">
              <span className="text-sm font-black uppercase tracking-wide text-stone-400">Arrivée Prévue</span>
              <span className="font-black text-amber-600">{ticket.eta}</span>
            </div>
          </div>

          <div className="space-y-4">
            {ticket.items.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center">
                <span className="text-sm font-bold">{item.quantity}x {item.name}</span>
                <span className="text-stone-400 text-sm">{(item.price * item.quantity).toLocaleString()} FCFA</span>
              </div>
            ))}
            <div className="pt-4 border-t border-stone-100 dark:border-white/10 flex justify-between items-end">
              <span className="text-sm font-black uppercase tracking-wide text-stone-400">Total Payé</span>
              <span className="text-2xl font-black text-amber-600">{grandTotal.toLocaleString()} FCFA</span>
            </div>
          </div>

          <div className="space-y-4">
            <button onClick={handleWhatsApp} className="w-full bg-stone-900 dark:bg-white dark:text-stone-900 text-white py-6 rounded-2xl font-black uppercase tracking-wide text-sm flex items-center justify-center gap-3">
              <Send className="w-4 h-4" /> Envoyer au Resto
            </button>
            <p className="text-sm text-stone-400 text-center font-bold px-4">Présentez ce ticket à votre arrivée pour récupérer votre commande.</p>
          </div>
        </div>
        <button onClick={onClose} className="w-full py-6 text-sm font-black uppercase tracking-wide text-stone-400 hover:text-stone-600 transition-colors">Fermer</button>
      </div>
    </div>
  );
};

const AdminPanel = ({ isOpen, onClose, menu, setMenu }: { isOpen: boolean, onClose: () => void, menu: MenuItem[], setMenu: React.Dispatch<React.SetStateAction<MenuItem[]>> }) => {
  const [pass, setPass] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItemImage, setNewItemImage] = useState<string | null>(null);
  const [editItemImage, setEditItemImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = () => {
    if (pass === ADMIN_PHONE) setIsAuthed(true);
    else alert('Code incorrect');
  };

  const updateItem = (item: MenuItem) => {
    setMenu(prev => prev.map(i => i.id === item.id ? item : i));
    setEditingItem(null);
  };

  const addNewItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: 'Nouveau Produit',
      price: 1000,
      priceString: '1,000 FCFA',
      description: 'Description du produit',
      image: newItemImage || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
      category: 'Plats',
      prepTime: 15
    };
    setMenu(prev => [...prev, newItem]);
    setNewItemImage(null);
  };

  if (!isAuthed) {
    return (
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-stone-900/90 backdrop-blur-md" onClick={onClose}></div>
        <div className="relative bg-white dark:bg-stone-900 w-full max-w-md rounded-[3rem] p-10 space-y-8 animate-in zoom-in-95">
          <div className="text-center space-y-4">
            <Settings className="w-16 h-16 text-amber-600 mx-auto" />
            <h3 className="text-3xl font-black tracking-tighter dark:text-white uppercase">Admin Login</h3>
          </div>
          <input
            type="password"
            placeholder="Code de vérification"
            value={pass}
            onChange={e => setPass(e.target.value)}
            className="w-full bg-stone-50 dark:bg-stone-950 border-none p-6 rounded-2xl font-bold focus:ring-2 ring-amber-600 outline-none"
          />
          <button onClick={handleLogin} className="w-full bg-amber-600 text-white py-6 rounded-2xl font-black uppercase tracking-wide text-sm shadow-xl">Se Connecter</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-end">
      <div className="absolute inset-0 bg-stone-900/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-stone-900 w-full max-w-4xl h-full shadow-2xl p-10 flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
        <div className="flex justify-between items-center mb-12">
          <h3 className="text-4xl font-black tracking-tighter flex items-center gap-4">
            <Settings className="w-8 h-8 text-amber-600" /> Dashboard Admin
          </h3>
          <button onClick={onClose} className="p-4 hover:bg-stone-100 dark:hover:bg-white/5 rounded-full"><X className="w-8 h-8" /></button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-4">
          {/* Section pour ajouter une image */}
          <div className="bg-stone-50 dark:bg-stone-950 p-6 rounded-3xl border border-stone-100 dark:border-white/5">
            <h4 className="text-sm font-black uppercase tracking-wide text-stone-400 mb-4">Image du nouveau produit</h4>
            <div className="space-y-4">
              {newItemImage ? (
                <div className="relative">
                  <img src={newItemImage} className="w-full h-48 rounded-2xl object-cover" alt="Preview" />
                  <button
                    onClick={() => setNewItemImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => document.getElementById('new-item-image')?.click()}
                  className="w-full h-48 border-2 border-dashed border-stone-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-amber-600 transition-all"
                >
                  <ImageIcon className="w-12 h-12 text-stone-300" />
                  <span className="text-sm font-bold text-stone-400">Cliquez pour ajouter une image</span>
                </div>
              )}
              <input
                id="new-item-image"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (re) => setNewItemImage(re.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          </div>

          <button
            onClick={addNewItem}
            className="w-full py-6 border-2 border-dashed border-amber-600/30 text-amber-600 rounded-3xl font-black uppercase tracking-wide text-sm flex items-center justify-center gap-4 hover:bg-amber-600/5 transition-all"
          >
            <PlusCircle className="w-5 h-5" /> Ajouter un produit
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menu.map(item => (
              <div key={item.id} className="bg-stone-50 dark:bg-stone-950 p-6 rounded-3xl border border-stone-100 dark:border-white/5 flex gap-6 items-center">
                <img src={item.image} className="w-24 h-24 rounded-2xl object-cover" alt={item.name} />
                <div className="flex-1 space-y-2">
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="text-amber-600 font-black text-sm">{item.priceString}</p>
                  <button
                    onClick={() => setEditingItem(item)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-amber-600 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" /> Modifier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {editingItem && (
          <div className="absolute inset-0 bg-white dark:bg-stone-900 z-10 p-10 flex flex-col animate-in slide-in-from-bottom-12">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-2xl font-black uppercase tracking-tighter">Modifier {editingItem.name}</h4>
              <button onClick={() => setEditingItem(null)} className="p-3 hover:bg-stone-100 dark:hover:bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-4">Image URL</label>
                <div className="flex gap-4">
                  <img src={editingItem.image} className="w-32 h-32 rounded-3xl object-cover shadow-xl" />
                  <textarea
                    value={editingItem.image}
                    onChange={e => setEditingItem({ ...editingItem, image: e.target.value })}
                    className="flex-1 bg-stone-50 dark:bg-stone-950 border-none p-6 rounded-[2rem] font-medium text-sm focus:ring-2 ring-amber-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-4">Nom</label>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-stone-950 border-none p-6 rounded-2xl font-bold focus:ring-2 ring-amber-600 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-4">Prix (Nombre)</label>
                  <input
                    type="number"
                    value={editingItem.price}
                    onChange={e => setEditingItem({ ...editingItem, price: parseInt(e.target.value), priceString: parseInt(e.target.value).toLocaleString() + ' FCFA' })}
                    className="w-full bg-stone-50 dark:bg-stone-950 border-none p-6 rounded-2xl font-bold focus:ring-2 ring-amber-600 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-4">Description</label>
                <textarea
                  value={editingItem.description}
                  onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={3}
                  className="w-full bg-stone-50 dark:bg-stone-950 border-none p-6 rounded-[2rem] font-medium text-sm focus:ring-2 ring-amber-600 outline-none"
                />
              </div>
            </div>

            <div className="pt-8 border-t border-stone-100 dark:border-white/10 flex gap-4">
              <button
                onClick={() => setMenu(prev => prev.filter(i => i.id !== editingItem.id))}
                className="flex-1 py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] text-red-500 hover:bg-red-500/5 transition-colors"
              >
                Supprimer
              </button>
              <button
                onClick={() => updateItem(editingItem)}
                className="flex-[2] bg-amber-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl flex items-center justify-center gap-3"
              >
                <Save className="w-4 h-4" /> Sauvegarder
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('amed_menu');
    return saved ? JSON.parse(saved) : MENU_DATA;
  });

  // Utiliser le hook de commande optimisé
  const { handleQuickOrder, handleOrderComplete, isProcessing, showOptionsModal, setShowOptionsModal } = useOrderFlow(cart, setCart);

  useEffect(() => {
    localStorage.setItem('amed_menu', JSON.stringify(menu));
  }, [menu]);

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
              onClick={() => setIsAdminOpen(true)}
              className={`p-4 rounded-xl transition-all border ${scrolled ? 'border-stone-200 dark:border-white/10 text-stone-900 dark:text-white hover:bg-stone-100 dark:hover:bg-white/5' : 'border-white/20 text-white hover:bg-white/10'}`}
            >
              <Settings className="w-5 h-5" />
            </button>
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
              L'Authentique <br />
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
                Qualité, Fraîcheur <br /> & <span className="text-amber-600">Passion.</span>
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
            {menu.map((item) => (
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

      {/* Système complet de commande et suivi des commissions */}
      <script dangerouslySetInnerHTML={{
        __html: `
          // Système de suivi des commissions
          // Système de suivi des commissions
          window.commissionSystem = {
            // Ajouter une commission
            addCommission: function(amount, orderType, clientName, clientPhone) {
              try {
                let commissions = [];
                try {
                  const stored = localStorage.getItem('amed_commissions');
                  commissions = stored ? JSON.parse(stored) : [];
                  if (!Array.isArray(commissions)) commissions = [];
                } catch (e) {
                  commissions = [];
                }

                const commission = {
                  id: Date.now(),
                  date: new Date().toISOString(),
                  amount: amount,
                  orderType: orderType,
                  clientName: clientName,
                  clientPhone: clientPhone,
                  status: 'en_attente'
                };
                commissions.push(commission);
                localStorage.setItem('amed_commissions', JSON.stringify(commissions));
              } catch (err) {
                // Silencieux pour ne pas bloquer
              }
            },
            
            // Calculer le total des commissions
            getTotalCommissions: function() {
              try {
                const stored = localStorage.getItem('amed_commissions');
                const commissions = stored ? JSON.parse(stored) : [];
                if (!Array.isArray(commissions)) return 0;
                return commissions.reduce((total, comm) => total + (comm.amount || 0), 0);
              } catch (e) {
                return 0;
              }
            },
            
            // Envoyer le rappel quotidien
            sendDailyReminder: function() {
              try {
                let commissions = [];
                try {
                  const stored = localStorage.getItem('amed_commissions');
                  commissions = stored ? JSON.parse(stored) : [];
                } catch (e) { return; }

                if (!Array.isArray(commissions)) return;

                const today = new Date().toDateString();
                const lastReminder = localStorage.getItem('last_reminder_date');
                
                if (lastReminder !== today) {
                  const totalPending = commissions
                    .filter(c => c.status === 'en_attente')
                    .reduce((total, comm) => total + (comm.amount || 0), 0);
                  
                  const totalPaid = commissions
                    .filter(c => c.status === 'payee')
                    .reduce((total, comm) => total + (comm.amount || 0), 0);
                  
                  const reminderMessage = \`💰 *RAPPEL QUOTIDIEN DES COMMISSIONS* 💰

📅 Date: \${new Date().toLocaleDateString('fr-FR')}
🕐 Heure: 21:00

💵 TOTAL EN ATTENTE: \${totalPending.toLocaleString()} FCFA
✅ TOTAL DÉJÀ PAYÉ: \${totalPaid.toLocaleString()} FCFA
💸 TOTAL À RECEVOIR: \${(totalPending + totalPaid).toLocaleString()} FCFA

📋 DÉTAIL DES COMMISSIONS EN ATTENTE:
\${commissions.filter(c => c.status === 'en_attente').map(c => 
  '• ' + c.clientName + ' - ' + c.amount.toLocaleString() + ' FCFA (' + c.orderType + ')'
).join('\\n')}

⚠️ ACTION RECOMMANDÉE:
📞 Contacter Amed Resto pour vérification
💵 Demander le paiement des commissions
📞 Numéro Amed: 22667609493

Merci gérer vos commissions !\`;
                  
                  // Envoyer le rappel à votre numéro
                  const ownerLink = \`https://wa.me/22666798031?text=\${encodeURIComponent(reminderMessage)}\`;
                  // Utiliser try-catch pour window.open qui peut être bloqué
                  try { window.open(ownerLink, '_blank'); } catch(e) { /* Popup bloqué */ }
                  
                  // Envoyer un résumé à Amed pour vérification
                  const amedMessage = \`📊 *VÉRIFICATION DES COMMISSIONS* 📊

📅 Date: \${new Date().toLocaleDateString('fr-FR')}
💰 Total commissions en attente: \${totalPending.toLocaleString()} FCFA

Merci de vérifier et régler les commissions dues.
Propriétaire: 22666798031\`;
                  
                  setTimeout(() => {
                    try {
                      window.open(\`https://wa.me/22667609493?text=\${encodeURIComponent(amedMessage)}\`, '_blank');
                    } catch(e) { /* Popup bloqué */ }
                  }, 3000);
                  
                  localStorage.setItem('last_reminder_date', today);
                }
              } catch (err) {
                // Silencieux pour ne pas bloquer
              }
            }
          };

          // Fonction principale de commande simplifiée
          window.handleQuickOrder = function() {
            try {
              const cart = window.cart || [];
              if (cart.length === 0) {
                alert('🛒 Veuillez ajouter des articles au panier');
                return;
              }
              
              const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
              const commission = 10; // Commission fixe de 10 FCFA
              const finalTotal = total + commission;
              
              // Demander le mode de commande
              const mode = prompt('🚀 MODE DE COMMANDE\\n\\n1️⃣ Je suis en route\\n2️⃣ Livraison (+500 FCFA)\\n3️⃣ Payer sur place\\n\\nEntrez 1, 2 ou 3 :');
              
              let deliveryFee = 0;
              let orderType = '';
              let eta = '';
              
              if (mode === '1') {
                orderType = '🚗 EN ROUTE';
                // Demander le temps d'arrivée uniquement pour l'option "en route"
                const timeChoice = prompt('⏰ TEMPS AVANT ARRIVÉE\\n\\nChoisissez les minutes avant votre arrivée :\\n\\n1️⃣ 5 minutes\\n2️⃣ 10 minutes\\n3️⃣ 15 minutes\\n4️⃣ 20 minutes\\n5️⃣ 25 minutes\\n6️⃣ 30 minutes\\n\\nEntrez 1, 2, 3, 4, 5 ou 6 :');
                
                const timeMap = {
                  '1': '5 minutes',
                  '2': '10 minutes', 
                  '3': '15 minutes',
                  '4': '20 minutes',
                  '5': '25 minutes',
                  '6': '30 minutes'
                };
                
                eta = timeMap[timeChoice] || '15 minutes';
              } else if (mode === '2') {
                orderType = '🏠 LIVRAISON';
                deliveryFee = 500;
                eta = '30-45 minutes';
              } else if (mode === '3') {
                orderType = '🍽️ SUR PLACE';
                eta = '15-20 minutes';
              } else {
                return;
              }
              
              const grandTotal = finalTotal;
              
              // Demander les infos client
              const name = prompt('👤 Votre nom :');
              if (!name) return;
              
              const phone = prompt('📞 Votre téléphone :');
              if (!phone) return;
              
              let address = '';
              if (mode === '2') {
                address = prompt('📍 Adresse de livraison :') || '';
                if (!address) return;
              }
              
              // Ajouter la commission au suivi
              try {
                if ((window as any).commissionSystem) {
                  (window as any).commissionSystem.addCommission(commission, orderType, name, phone);
                }
              } catch (e) { 
                // Silencieux pour ne pas bloquer
              }
              
              // Message pour le restaurant (avec commission incluse)
              const restaurantMessage = \`⚡ *COMMANDE RAPIDE* ⚡\\n\\n\${orderType}\\n👤 Client: \${name}\\n📞 Tel: \${phone}\${address ? '\\n📍 ' + address : ''}\\n\\n🛒 Commande:\\n\${cart.map(i => '• ' + i.quantity + 'x ' + i.name + ' (' + (i.price * i.quantity).toLocaleString() + ' FCFA)').join('\\n')}\\n\\n💰 Total commande: \${total.toLocaleString()} FCFA\\n💸 Commission (4%): \${commission.toLocaleString()} FCFA\${deliveryFee ? '\\n🚚 Livraison: ' + deliveryFee.toLocaleString() + ' FCFA' : ''}\\n💵 TOTAL À PAYER: \${grandTotal.toLocaleString()} FCFA\\n\\n⏰ Préparation: \${eta}\\n💳 Paiement: Orange Money\\n\\n⚠️ COMMISSION À VÉRIFIER: \${commission.toLocaleString()} FCFA\`;
              
              // Message pour le propriétaire (suivi)
              const ownerMessage = \`💰 *NOUVELLE COMMISSION ENREGISTRÉE* 💰\\n\\n📦 Commande: \${orderType}\\n👤 Client: \${name}\\n📞 Tel: \${phone}\\n💵 Commission: \${commission.toLocaleString()} FCFA\\n💰 Total commande: \${grandTotal.toLocaleString()} FCFA\\n\\n⏰ Paiement en cours...\\n\\n📊 Suivi automatique activé\`;
              
              // Envoyer les messages
              window.open(\`https://wa.me/22667609493?text=\${encodeURIComponent(restaurantMessage)}\`, '_blank');
              
              setTimeout(() => {
                window.open(\`https://wa.me/22666798031?text=\${encodeURIComponent(ownerMessage)}\`, '_blank');
              }, 2000);
              
              // Instructions de paiement Orange Money
              setTimeout(() => {
                const paymentInstructions = \`💳 *PAIEMENT ORANGE MONEY* 💳

📞 Compte restaurant: 67609493
💰 Montant: \${grandTotal.toLocaleString()} FCFA

🔟 ÉTAPES SIMPLES:
1️⃣ Composer *144*10*67609493*\${grandTotal}#
2️⃣ Confirmer le montant
3️⃣ Entrer votre code secret

✅ Paiement validé = Commande confirmée !
💸 Commission: \${commission.toLocaleString()} FCFA (à vérifier)

⏰ Votre commande sera prête en \${eta}\`;
                
                alert(paymentInstructions);
                
                // Ouvrir Orange Money automatiquement avec le bon format
                window.location.href = 'tel:*144*10*67609493*' + grandTotal + '#';
              }, 4000);
              
            } catch (error) {
              alert('❌ Erreur: ' + error.message);
            }
          };

          // Vérifier et envoyer le rappel quotidien (activé selon documentation)
          // window.commissionSystem.sendDailyReminder();
          
          // Vérifier toutes les heures (activé selon documentation - 21h00)
          setInterval(() => {
            const now = new Date();
            if (now.getHours() === 21 && now.getMinutes() === 0) {
              window.commissionSystem.sendDailyReminder();
            }
          }, 60000); // Vérifier chaque minute
        `
      }} />

      {/* Modal de Commande */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        cart={cart}
        onComplete={(data) => {
          setActiveTicket(data);
          // Ajouter à l'historique local si nécessaire
          setCart([]);
        }}
      />

      {/* Modal de Ticket */}
      <TicketModal
        ticket={activeTicket}
        onClose={() => setActiveTicket(null)}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        menu={menu}
        setMenu={setMenu}
      />

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
              <p className="text-white text-2xl font-black">+226 67 60 94 93</p>
            </div>
            <div className="space-y-3">
              <p className="text-amber-500 font-black uppercase tracking-widest text-[10px]">Emplacement</p>
              <p className="text-white text-lg font-bold">Quartier Nonsin, Ouaga</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-16 mt-16 border-t border-white/5 text-center text-[10px] font-black uppercase tracking-[0.4em] text-stone-500">
          <p>© 2026 Cafe Resto Amed • L'excellence à chaque bouchée.</p>
          <p className="mt-2 text-amber-600">Concepteurs : SAWADOGO Stephane & DABIRÉ Windson</p>
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

      {/* Bouton WhatsApp flottant */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Bonjour Amed Resto ! Je souhaite passer une commande ou faire une réservation.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button-fixed bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 animate-bounce flex items-center justify-center"
        style={{ zIndex: 9999 }}
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Bouton unique de commande rapide optimisé */}
      <OrderButton cart={cart} onOrder={handleQuickOrder} />

      {/* Modal des options de commande */}
      <OrderOptionsModal
        isOpen={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        onSelectMode={(mode: string, time?: string, address?: string, name?: string, phone?: string) => {
          handleOrderComplete(mode, time, address, name, phone);
        }}
        cartTotal={cart.reduce((s, i) => s + (i.price * i.quantity), 0)}
      />
    </div>
  );
}
