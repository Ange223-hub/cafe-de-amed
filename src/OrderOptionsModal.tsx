import React, { useState } from 'react';
import { X, Clock, MapPin, User, Phone, Check } from 'lucide-react';
import { CartItem } from './types';

interface OrderOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: string, time?: string, address?: string, name?: string, phone?: string) => void;
  cartTotal: number;
}

export const OrderOptionsModal: React.FC<OrderOptionsModalProps> = ({
  isOpen,
  onClose,
  onSelectMode,
  cartTotal
}) => {
  const [mode, setMode] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);

  const deliveryFee = mode === '2' ? 500 : 0;

  const handleLocationDetect = async () => {
    setLocationLoading(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      
      const detectedAddress = data.display_name || `GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      setAddress(detectedAddress);
    } catch (error) {
      setAddress('Localisation non disponible');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleModeSelect = (selectedMode: string) => {
    setMode(selectedMode);
    if (selectedMode === '1') {
      handleLocationDetect();
    }
  };

  const handleValidate = () => {
    if (!mode || !name || !phone) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (mode === '1' && !address) {
      alert('Veuillez renseigner votre adresse pour la livraison');
      return;
    }

    if (mode === '1' && !time) {
      alert('Veuillez sélectionner un créneau horaire pour la livraison');
      return;
    }

    onSelectMode(mode, time, address, name, phone);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Finaliser la commande</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium">Total panier: {cartTotal.toLocaleString()} FCFA</p>
            <p className="text-xs text-gray-500">+ 10 FCFA de commission</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mode de commande</label>
            <div className="space-y-2">
              <button
                onClick={() => handleModeSelect('1')}
                className={`w-full p-3 rounded-lg border text-left ${mode === '1' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              >
                <div className="font-medium">🏠 Livraison (500 FCFA)</div>
                <div className="text-xs text-gray-500">30-45 minutes</div>
              </button>
              <button
                onClick={() => handleModeSelect('2')}
                className={`w-full p-3 rounded-lg border text-left ${mode === '2' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              >
                <div className="font-medium">🚗 Retrait sur place</div>
                <div className="text-xs text-gray-500">15-20 minutes</div>
              </button>
              <button
                onClick={() => handleModeSelect('3')}
                className={`w-full p-3 rounded-lg border text-left ${mode === '3' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              >
                <div className="font-medium">🍽️ Sur place</div>
                <div className="text-xs text-gray-500">20-30 minutes</div>
              </button>
            </div>
          </div>

          {mode === '1' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Créneau horaire</label>
                <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full p-3 border rounded-lg">
                  <option value="">Sélectionner un créneau</option>
                  <option value="1">12h00 - 12h30</option>
                  <option value="2">12h30 - 13h00</option>
                  <option value="3">13h00 - 13h30</option>
                  <option value="4">19h00 - 19h30</option>
                  <option value="5">19h30 - 20h00</option>
                  <option value="6">20h00 - 20h30</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Adresse de livraison</label>
                <div className="space-y-2">
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Entrez votre adresse"
                    className="w-full p-3 border rounded-lg"
                    rows={3}
                  />
                  <button
                    onClick={handleLocationDetect}
                    disabled={locationLoading}
                    className="w-full p-2 bg-blue-500 text-white rounded-lg text-sm disabled:bg-gray-300"
                  >
                    {locationLoading ? 'Détection...' : '📍 Détecter ma position'}
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Nom complet</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Téléphone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Votre numéro"
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4">
          <button
            onClick={handleValidate}
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-medium"
          >
            Valider la commande
          </button>
        </div>
      </div>
    </div>
  );
};
