// services/geoDBService.js
import axios from 'axios';

// A chave agora é lida de forma segura a partir do arquivo .env
const GEO_API_KEY = process.env.EXPO_PUBLIC_RAPIDAPI_API_KEY; 
const GEO_API_HOST = 'wft-geo-db.p.rapidapi.com';
const GEO_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities';

export const findCities = async (namePrefix) => {
  if (!namePrefix || namePrefix.length < 3) return [];
  try {
    const response = await axios.get(GEO_API_URL, {
      params: {
        namePrefix: namePrefix,
        minPopulation: 100000,
        sort: '-population',
        limit: 5
      },
      headers: {
        'x-rapidapi-host': GEO_API_HOST,
        'x-rapidapi-key': GEO_API_KEY,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Erro ao buscar sugestões de cidades:", error.message);
    // Adiciona um tratamento de erro mais específico para o erro 403
    if (error.response && error.response.status === 403) {
      throw new Error("A chave da API GeoDB é inválida ou você não está subscrito ao plano. Verifique sua chave no site da RapidAPI.");
    }
    // Retorna um array vazio para não quebrar a UI em outros erros
    return [];
  }
};
