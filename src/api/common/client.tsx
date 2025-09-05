// import { Env } from '@env';
import axios from 'axios';
export const client = axios.create({
  // baseURL: Env.API_URL,
  baseURL: 'https://dummyjson.com/', // temporarily hardcode
});
