import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',      // 用 Next.js 转发到 47.117.144.50:8000/api
  withCredentials: true // 带 Cookie
});
