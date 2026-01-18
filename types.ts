
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  priceString: string;
  category: 'Grillades' | 'Burgers' | 'Pizzas' | 'Salades' | 'Boissons';
  image: string;
}

export interface Review {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}
