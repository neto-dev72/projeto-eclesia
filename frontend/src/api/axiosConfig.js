// src/api/axiosConfig.js
import axios from 'axios';


const api = axios.create({
  baseURL: 'http://168.231.112.34:8000', // URL do backend na VPS
});

// Interceptor para enviar o token automaticamente em todas as requisições
api.interceptors.request.use(
  config => {
    // Pega o token do localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // Adiciona o header Authorization no formato Bearer
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    // Qualquer erro na requisição
    return Promise.reject(error);
  }
);

export default api;
