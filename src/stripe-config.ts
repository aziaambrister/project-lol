export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: string;
  coins?: number;
  bundle?: boolean;
  includes?: Array<{
    name: string;
    description: string;
    icon: string;
  }>;
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_SXymgE84tSLDvt',
    priceId: 'price_1Rcsp9P0VJGKhWxlxJ4ei2Rf',
    name: '1000 coins',
    description: 'Get 1,000 coins instantly to upgrade your gear!',
    mode: 'payment',
    price: '$1.99',
    coins: 1000
  },
  {
    id: 'prod_SXynejZntKDesy',
    priceId: 'price_1RcspjP0VJGKhWxlJrBLwFt6',
    name: '5000 coins',
    description: 'Get 5,000 coins instantly - best value!',
    mode: 'payment',
    price: '$4.99',
    coins: 5000
  },
  {
    id: 'prod_SXynPE9iwAaKht',
    priceId: 'price_1RcsqLP0VJGKhWxlaPVJBMP1',
    name: '10000 coins',
    description: 'Get 10,000 coins instantly - ultimate package!',
    mode: 'payment',
    price: '$9.99',
    coins: 10000
  },
  {
    id: 'prod_SXypmqjwBg2VvH',
    priceId: 'price_1RcsrTP0VJGKhWxlKkunQzQV',
    name: "Founder's Glory Bundle",
    description: 'Exclusive founder character with 400 health + legendary Founder\'s Scepterblade with 50 damage!',
    mode: 'payment',
    price: '$9.99',
    bundle: true,
    includes: [
      {
        name: 'The Founder',
        description: 'Exclusive founder character with 400 health',
        icon: '👑'
      },
      {
        name: "Founder's Scepterblade",
        description: 'Legendary weapon with 50 damage',
        icon: '⚔️'
      }
    ]
  },
  {
    id: 'prod_MysticAlchemist',
    priceId: 'price_mystic_alchemist_bundle',
    name: "Mystic Alchemist's Bundle",
    description: 'Exclusive Mystic Alchemist character + legendary Vialborne Staff with 40 damage!',
    mode: 'payment',
    price: '$12.99',
    bundle: true,
    includes: [
      {
        name: 'Mystic Alchemist',
        description: 'Exclusive alchemist character with unique abilities',
        icon: '🧙‍♂️'
      },
      {
        name: 'Vialborne Staff',
        description: 'Legendary staff with 40 damage and alchemical powers',
        icon: '🧪'
      }
    ]
  }
];