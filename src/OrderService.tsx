import { OrderData, CartItem } from './types';

export class OrderService {
  static calculateOrderTotal(cart: CartItem[]): { total: number; commission: number; finalTotal: number } {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const commission = 10; // Fixe à 10 FCFA
    const finalTotal = total + commission;
    
    return { total, commission, finalTotal };
  }

  static getOrderType(mode: string): { orderType: string; deliveryFee: number; eta: string } {
    switch(mode) {
      case '1':
        return { orderType: '🏠 LIVRAISON À DOMICILE', deliveryFee: 500, eta: '30-45 minutes' };
      case '2':
        return { orderType: '🚗 RETRAIT SUR PLACE', deliveryFee: 0, eta: '15-20 minutes' };
      case '3':
        return { orderType: '🍽️ SUR PLACE', deliveryFee: 0, eta: '20-30 minutes' };
      default:
        return { orderType: '📦 COMMANDE', deliveryFee: 0, eta: '30 minutes' };
    }
  }

  static getTimeChoice(time: string): string {
    const timeMap: { [key: string]: string } = {
      '1': '12h00 - 12h30',
      '2': '12h30 - 13h00', 
      '3': '13h00 - 13h30',
      '4': '19h00 - 19h30',
      '5': '19h30 - 20h00',
      '6': '20h00 - 20h30'
    };
    return timeMap[time] || '30 minutes';
  }

  static generatePaymentInstructions(grandTotal: number, eta: string, isOnSite: boolean = false): string {
    if (isOnSite) {
      return "💳 PAIEMENT SUR PLACE\n\n📞 Compte restaurant: 67609493\n💰 Montant: " + grandTotal.toLocaleString() + " FCFA\n\n✅ Montant déjà pré-rempli: *" + grandTotal + " FCFA*\n⏰ Votre commande sera prête en " + eta;
    } else {
      return "💳 PAIEMENT ORANGE MONEY\n\n📞 Compte restaurant: 67609493\n💰 Montant: " + grandTotal.toLocaleString() + " FCFA\n\n🔟 ÉTAPES SIMPLES:\n1️⃣ Composer *144*10*67609493*" + grandTotal + "#\n2️⃣ Confirmer le montant\n3️⃣ Entrer votre code secret\n\n✅ Paiement validé = Commande confirmée !\n⏰ Votre commande sera prête en " + eta;
    }
  }

  static async processOrder(orderData: OrderData): Promise<void> {
    return new Promise((resolve) => {
      const { orderType, deliveryFee, eta: defaultEta } = OrderService.getOrderType(orderData.mode);
      let eta = defaultEta;
      
      if (orderData.mode === '1' && orderData.eta) {
        eta = orderData.eta;
      }
      
      const grandTotal = orderData.total + orderData.commission + deliveryFee;
      
      let restaurantMessage = "⚡ COMMANDE RAPIDE ⚡\n\n" + orderType + "\n👤 Client: " + orderData.name + "\n📞 Tel: " + orderData.phone;
      
      if (orderData.address) {
        restaurantMessage += "\n📍 " + orderData.address;
      }
      
      restaurantMessage += "\n\n🛒 Commande:\n" + orderData.cart.map(i => "• " + i.quantity + "x " + i.name + " (" + (i.price * i.quantity).toLocaleString() + " FCFA)").join("\n");
      restaurantMessage += "\n\n💰 Total commande: " + orderData.total.toLocaleString() + " FCFA\n💸 Commission: " + orderData.commission.toLocaleString() + " FCFA\n💵 TOTAL À PAYER: " + grandTotal.toLocaleString() + " FCFA\n\n⏰ Préparation: " + eta + "\n💳 Paiement: Orange Money";
      
      const ownerMessage = "💰 NOUVELLE COMMISSION 💰\n\n📦 " + orderType + "\n👤 " + orderData.name + "\n📞 " + orderData.phone + "\n💵 " + orderData.commission.toLocaleString() + " FCFA\n💰 Total: " + grandTotal.toLocaleString() + " FCFA";
      
      setTimeout(() => {
        window.open(`https://wa.me/22667609493?text=${encodeURIComponent(restaurantMessage)}`, '_blank');
      }, 500);
      
      setTimeout(() => {
        window.open(`https://wa.me/22666798031?text=${encodeURIComponent(ownerMessage)}`, '_blank');
      }, 1500);
      
      setTimeout(() => {
        const paymentInstructions = this.generatePaymentInstructions(grandTotal, eta, orderData.mode === '3');
        alert(paymentInstructions);
        
        window.location.href = `tel:*144*10*67609493*${grandTotal}#`;
      }, 2500);
      
      resolve();
    });
  }
}
