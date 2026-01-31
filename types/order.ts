import { CartItem } from '../types';

export interface OrderData {
  cart: CartItem[];
  name: string;
  phone: string;
  address?: string;
  mode: string;
  eta: string;
  total: number;
  commission: number;
  grandTotal: number;
}

export interface OrderCompleteData extends OrderData {
  orderId: string;
  paymentSnapshot?: string;
  location?: {
    lat: number;
    lng: number;
  };
  items: CartItem[]; // Ajout de items pour compatibilité
}

export interface TicketData {
  orderId: string;
  name: string;
  phone: string;
  address?: string;
  mode: string;
  eta: string;
  items: CartItem[];
  total: number;
  paymentSnapshot?: string;
  location?: {
    lat: number;
    lng: number;
  };
}
