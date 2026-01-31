import { CartItem } from '../types';
import { OrderData } from '../types/order';

export type { OrderData };

export class OrderService {
  static calculateOrderTotal(cart: CartItem[]): { total: number; commission: number; finalTotal: number } {
    const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const commission = 10; // Commission fixe de 10 FCFA
    const finalTotal = total + commission;
    return { total, commission, finalTotal };
  }

  static getOrderType(mode: string): { orderType: string; deliveryFee: number; eta: string } {
    switch (mode) {
      case '1':
        return { orderType: '🚗 EN ROUTE', deliveryFee: 0, eta: '' }; // Sera défini par le choix des minutes
      case '2':
        return { orderType: '🏠 LIVRAISON', deliveryFee: 500, eta: '30-45 minutes' };
      case '3':
        return { orderType: '🍽️ SUR PLACE', deliveryFee: 0, eta: '15-20 minutes' };
      default:
        return { orderType: '', deliveryFee: 0, eta: '' };
    }
  }

  static getTimeChoice(choice: string): string {
    const timeMap: { [key: string]: string } = {
      '1': '5 minutes',
      '2': '10 minutes',
      '3': '15 minutes',
      '4': '20 minutes',
      '5': '25 minutes',
      '6': '30 minutes'
    };
    return timeMap[choice] || '15 minutes';
  }

  static generateWhatsAppMessage(orderData: OrderData): { restaurant: string; owner: string } {
    const { cart, name, phone, address, mode, eta, total, commission, grandTotal } = orderData;
    const orderType = this.getOrderType(mode).orderType;

    const restaurantMessage = "⚡ *COMMANDE RAPIDE* ⚡\n\n" + orderType + "\n👤 Client: " + name + "\n📞 Tel: " + phone + (address ? "\n📍 " + address : "") + "\n\n🛒 Commande:\n" + cart.map((i: CartItem) => "• " + i.quantity + "x " + i.name + " (" + (i.price * i.quantity).toLocaleString() + " FCFA)").join("\n") + "\n\n💰 Total commande: " + total.toLocaleString() + " FCFA\n💸 Commission: " + commission.toLocaleString() + " FCFA\n💵 TOTAL À PAYER: " + grandTotal.toLocaleString() + " FCFA\n\n⏰ Préparation: " + eta + "\n💳 Paiement: Orange Money\n\n⚠️ COMMMISSION À VÉRIFIER: " + commission.toLocaleString() + " FCFA";

    const ownerMessage = "💰 *NOUVELLE COMMISSION ENREGISTRÉE* 💰\n\n📦 Commande: " + orderType + "\n👤 Client: " + name + "\n📞 Tel: " + phone + "\n💵 Commission: " + commission.toLocaleString() + " FCFA\n💰 Total commande: " + grandTotal.toLocaleString() + " FCFA\n\n⏰ Paiement en cours...\n\n📊 Suivi automatique activé";

    return { restaurant: restaurantMessage, owner: ownerMessage };
  }

  static generatePaymentInstructions(grandTotal: number, eta: string, isOnSite: boolean = false): string {
    if (isOnSite) {
      return "💳 *PAIEMENT SUR PLACE* 💳\n\n📞 Compte restaurant: 67609493\n💰 Montant: " + grandTotal.toLocaleString() + " FCFA\n\n🔟 ÉTAPES SIMPLES:\n1️⃣ Orange Money s'ouvre déjà rempli\n2️⃣ Appuyez sur \"Valider\"\n3️⃣ Entrez seulement votre code secret\n4️⃣ C'est payé ! 🎉\n\n✅ Montant déjà pré-rempli: *" + grandTotal + " FCFA*\n⏰ Votre commande sera prête en " + eta;
    } else {
      return "💳 *PAIEMENT ORANGE MONEY* 💳\n\n📞 Compte restaurant: 67609493\n💰 Montant: " + grandTotal.toLocaleString() + " FCFA\n\n🔟 ÉTAPES SIMPLES:\n1️⃣ Composer *144*10*67609493*" + grandTotal + "#\n2️⃣ Confirmer le montant\n3️⃣ Entrer votre code secret\n\n✅ Paiement validé = Commande confirmée !\n💸 Commission: 10 FCFA (à vérifier)\n\n⏰ Votre commande sera prête en " + eta;
    }
  }

  static async processOrder(orderData: OrderData): Promise<void> {
    return new Promise((resolve) => {
      const { orderType, deliveryFee, eta: defaultEta } = OrderService.getOrderType(orderData.mode);
      let eta = defaultEta;
      
      // Utiliser le temps choisi pour l'option "en route"
      if (orderData.mode === '1' && orderData.eta) {
        eta = orderData.eta;
      }
      
      const grandTotal = orderData.total + orderData.commission + deliveryFee;
      
      // Message pour le restaurant
      let restaurantMessage = `⚡ *COMMANDE* ⚡\n\n${orderType}\n👤 Client: ${orderData.name}\n📞 Tel: ${orderData.phone}`;
      
      if (orderData.address) {
        restaurantMessage += `\n📍 ${orderData.address}`;
      }
      
      restaurantMessage += `\n\n🛒 Commande:\n${orderData.cart.map((i: CartItem) => '• ' + i.quantity + 'x ' + i.name + ' (' + (i.price * i.quantity).toLocaleString() + ' FCFA)').join('\n')}`;
      restaurantMessage += `\n\n💰 Total: ${grandTotal.toLocaleString()} FCFA`;
      restaurantMessage += `\n⏰ ${eta}`;
      
      // Ajouter des instructions spécifiques selon le mode
      if (orderData.mode === '3') {
        restaurantMessage += `\n\n💳 **PAIEMENT SUR PLACE**`;
        restaurantMessage += `\n⚠️ Client sur place - Préparer la commande`;
        restaurantMessage += `\n📞 Tel: ${orderData.phone} (pour confirmation)`;
      } else if (orderData.mode === '2') {
        restaurantMessage += `\n\n🚚 **LIVRAISON À DOMICILE**`;
        restaurantMessage += `\n⚠️ Préparer pour livraison - Client attend`;
      } else {
        restaurantMessage += `\n\n🚗 **CLIENT EN ROUTE**`;
        restaurantMessage += `\n⚠️ Client vient chercher - Préparer pour retrait`;
      }
      
      // Ajouter les informations de paiement
      restaurantMessage += `\n\n💳 **PAIEMENT ORANGE MONEY**`;
      
      // Message pour le propriétaire (suivi commission)
      const ownerMessage = `💰 *NOUVELLE COMMISSION* 💰\n\n📦 ${orderType}\n👤 ${orderData.name}\n📞 ${orderData.phone}\n💵 ${orderData.commission.toLocaleString()} FCFA\n💰 Total: ${grandTotal.toLocaleString()} FCFA\n\n⏰ Paiement en cours...\n\n📊 Suivi automatique activé`;
      
      // Envoyer les messages
      setTimeout(() => {
        window.open(`https://wa.me/22667609493?text=${encodeURIComponent(restaurantMessage)}`, '_blank');
      }, 500);
      
      setTimeout(() => {
        window.open(`https://wa.me/22666798031?text=${encodeURIComponent(ownerMessage)}`, '_blank');
      }, 1500);
      
      // Pour "sur place", aussi utiliser Orange Money mais plus simple
      setTimeout(() => {
        const paymentInstructions = this.generatePaymentInstructions(grandTotal, eta, orderData.mode === '3');
        alert(paymentInstructions);
        
        // Ouvrir Orange Money automatiquement
        window.location.href = `tel:*144*10*67609493*${grandTotal}#`;
      }, 2500);
      
      resolve();
    });
  }
}
