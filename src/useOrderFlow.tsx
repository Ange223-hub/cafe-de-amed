import { useState, useCallback } from 'react';
import { CartItem } from './types';
import { OrderService } from './OrderService';

export const useOrderFlow = (cart: CartItem[], setCart: React.Dispatch<React.SetStateAction<CartItem[]>>) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const handleQuickOrder = useCallback(() => {
    if (cart.length === 0) {
      alert('🛒 Votre panier est vide');
      return;
    }
    setShowOptionsModal(true);
  }, [cart]);

  const handleOrderComplete = async (mode: string, time?: string, address?: string, name?: string, phone?: string) => {
    if (!name || !phone) {
      alert('Informations incomplètes');
      return;
    }

    try {
      setIsProcessing(true);
      
      const { total, commission, finalTotal } = OrderService.calculateOrderTotal(cart);
      const { orderType, deliveryFee, eta: defaultEta } = OrderService.getOrderType(mode);
      
      let eta = defaultEta;
      
      if (mode === '1' && time) {
        eta = OrderService.getTimeChoice(time);
      }
      
      const grandTotal = finalTotal + deliveryFee;
      
      try {
        if ((window as any).commissionSystem) {
          (window as any).commissionSystem.addCommission(commission, orderType, name, phone);
        }
      } catch (e) {
        // Silencieux pour ne pas bloquer l'expérience utilisateur
      }

      const orderData = {
        cart,
        name,
        phone,
        address,
        mode,
        eta,
        total,
        commission,
        grandTotal
      };
      
      await OrderService.processOrder(orderData);
      
      setCart([]);
      setShowOptionsModal(false);
      
    } catch (error) {
      alert('❌ Erreur: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleQuickOrder,
    handleOrderComplete,
    isProcessing,
    showOptionsModal,
    setShowOptionsModal
  };
};
