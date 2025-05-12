import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',      // 会被 Next.js 转发到 47.117.144.50:8000/api
  withCredentials: true // 如果你需要带 Cookie
});
