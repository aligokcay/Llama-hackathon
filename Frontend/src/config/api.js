// API base URL - production'da Azure URL'i kullanılacak
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app.azurewebsites.net/api' 
  : 'http://localhost:8000/api';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    generateCaption: '/generate-caption/',
    getPostingAdvice: '/get-posting-advice/'
  }
};

export default apiConfig;

