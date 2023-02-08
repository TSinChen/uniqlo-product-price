export interface ProductResultTW {
  msgCode: null;
  msg: null;
  resp: Array<ProductDetailTW[]>;
  success: boolean;
  total: number;
}

export interface ProductDetailTW {
  item: Array<PurpleItem[] | FluffyItem | string>;
  name: string;
  code: string;
  gender: string;
  maxSize: string;
  preSaleName: string;
  originPrice: number;
  designScore: number;
  isBmProduct: string;
  sales: number;
  productName: string;
  firstRank: number;
  score: string;
  identity: string[];
  maxVaryPrice: number;
  season: string;
  mainPic: string;
  minSize: string;
  prices: number[];
  omsProductCode: string;
  stock: string;
  new: number;
  chipPic: string[];
  colorPic: string[];
  styleText: string[];
  fabricScore: number;
  priceColor: string;
  stores: any[];
  sex: string;
  minVaryPrice: number;
  label: string;
  timeLimitedBegin: number;
  productCode: string;
  material: string;
  size: string[];
  evaluationCount: number;
  timeLimitedEnd: number;
  minPrice: number;
  overall: number;
  sizeScore: number;
  maxPrice: number;
  colorNums: string[];
}

export interface PurpleItem {
  sizeValue: string;
  sizeCode: string;
  sizeNoSuffix: string;
}

export interface FluffyItem {
  name: string;
}
