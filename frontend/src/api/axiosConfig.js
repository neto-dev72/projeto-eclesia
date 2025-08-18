// src/api/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  // aqui pode adicionar outros configs globais tipo headers, timeout, etc
});

export default api;
