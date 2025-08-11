export interface ShopItem {
  id: string;
  name: string;
  type: 'circle_style';
  price: number;
  className?: string;
  imageUrl?: string;
  imageHint?: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'style_default', name: 'Vibrant Purple', type: 'circle_style', price: 0, className: 'bg-primary rounded-full' },
  { id: 'style_electric', name: 'Electric Blue', type: 'circle_style', price: 50, className: 'bg-accent rounded-full' },
  { id: 'style_sunburst', name: 'Sunburst Orange', type: 'circle_style', price: 75, className: 'bg-chart-1 rounded-full' },
  { id: 'style_forest', name: 'Forest Green', type: 'circle_style', price: 75, className: 'bg-chart-2 rounded-full' },
  { id: 'style_golden', name: 'Goldenrod', type: 'circle_style', price: 100, imageUrl: 'https://placehold.co/100x100.png', imageHint: 'gold coin' },
  { id: 'style_square', name: 'The Square', type: 'circle_style', price: 150, className: 'bg-primary' },
  { id: 'style_ring', name: 'The Ring', type: 'circle_style', price: 200, imageUrl: 'https://placehold.co/100x100.png', imageHint: 'diamond ring' },
  { id: 'style_ghost', name: 'Ghost', type: 'circle_style', price: 250, className: 'bg-primary/50 rounded-full' },
];
