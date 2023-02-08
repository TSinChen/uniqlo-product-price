export interface ProductResultJP {
  status: string;
  result: Result;
}

export interface ProductDetailJP {
  colors: Color[];
  genderName: string;
  genderCategory: string;
  images: Images;
  l1Id: string;
  name: string;
  prices: Prices;
  productId: string;
  priceGroup: string;
  plds: Pld[];
  rating: ItemRating;
  representative: Representative;
  sizes: Pld[];
  promotionText: string;
  storeStockOnly: boolean;
}

export interface Result {
  aggregations: Aggregations;
  items: ProductDetailJP[];
  pagination: Pagination;
  relaxedQueries: string[];
  relaxedQueryItems: any[];
}

export interface Aggregations {
  colors: Color[];
  flags: Flag[];
  plds: Pld[];
  sizes: Pld[];
  prices: Price[];
  ratings: RatingElement[];
  tree: Tree;
}

export interface Color {
  code: string;
  displayCode: string;
  name: string;
  display: Display;
  filterCode: string;
  hexBackgroundColor?: string;
}

export interface Display {
  showFlag: boolean;
  chipType: number;
}

export interface Flag {
  id: number;
  code: string;
  rank: number;
  name: string;
  docCount: number;
}

export interface Pld {
  code: string;
  displayCode: string;
  name: string;
  docCount?: number;
  display?: Display;
}

export interface Price {
  from: number;
  to: number;
  count: number;
  key: string;
}

export interface RatingElement {
  rating: number;
  accumulated: number;
  count: number;
}

export interface Tree {
  genders: Category[];
  classes: Category[];
  categories: Category[];
  subcategories: Category[];
}

export interface Category {
  id: number;
  name: string;
}

export interface Images {
  main: { [key: string]: Main };
  chip: { [key: string]: string };
  sub: Main[];
}

export interface Main {
  image: string;
  model: any[];
  video?: string;
}

export interface Prices {
  base: Base;
  promo: Base;
  isDualPrice: boolean;
}

export interface Base {
  currency: Currency;
  value: number;
}

export interface Currency {
  code: string;
  symbol: string;
}

export interface ItemRating {
  average: number;
  count: number;
}

export interface Representative {
  color: Color;
  flags: Flags;
  l2Id: string;
  pld: Pld;
  sales: boolean;
  size: Pld;
  communicationCode: string;
}

export interface Flags {
  priceFlags: PriceFlag[];
  productFlags: any[];
}

export interface PriceFlag {
  code: string;
  name: string;
  rank: number;
  id: number;
  type: string;
  effectiveTime: EffectiveTime;
  flagColor: string;
  nameWording: NameWording;
}

export interface EffectiveTime {
  start: number;
  end: number;
}

export interface NameWording {
  flagWithTime: string;
  substitutions: Substitutions;
}

export interface Substitutions {
  date: string;
  flagName: string;
}

export interface Pagination {
  total: number;
  offset: number;
  count: number;
}
