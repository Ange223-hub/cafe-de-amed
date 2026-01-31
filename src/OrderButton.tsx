import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { CartItem } from './types';
import { useOrderFlow } from './useOrderFlow';

interface OrderButtonProps {
  cart: CartItem[];
  onOrder: () => void;
}

export const OrderButton: React.FC<OrderButtonProps> = ({ cart, onOrder }) => {
  const { handleQuickOrder } = useOrderFlow(cart, () => {});

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <button
      onClick={onOrder}
      className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-40"
    >
      <ShoppingBag className="w-6 h-6" />
      {cart.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
          {cart.length}
        </span>
      )}
    </button>
  );
};
