import axios from 'axios';

import { ProductResultJP } from './../types/jp';
import { ProductResultTW } from '../types/tw';

const BASE_URL = 'https://uniqlo-product-price-backend.vercel.app';
// const BASE_URL = 'http://localhost:3001';

export const getProductJP = async (id: string): Promise<ProductResultJP> =>
  (await axios.get(`${BASE_URL}/jp/${id}`)).data;
export const getProductTW = async (id: string): Promise<ProductResultTW> =>
  (await axios.get(`${BASE_URL}/tw/${id}`)).data;
export const getJPY = async () => (await axios.get('https://api.exchangerate-api.com/v4/latest/TWD')).data;
