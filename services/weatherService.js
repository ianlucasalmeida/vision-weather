// services/weatherService.js
import axios from 'axios';

const API_KEY = 'e46f7a24676c1ea29908a0bfaae99c86';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherAndForecast = async (location) => {
  try {
    let weatherParams, forecastParams;
    const commonParams = { appid: API_KEY, units: 'metric', lang: 'pt_br' };

    if (location.type === 'coords') {
      const { latitude, longitude } = location.payload;
      weatherParams = { lat: latitude, lon: longitude, ...commonParams };
      forecastParams = { lat: latitude, lon: longitude, ...commonParams };
    } else if (location.type === 'city') {
      // --- CORREÇÃO DE ROBUSTEZ APLICADA AQUI ---
      // Esta lógica agora lida com diferentes formatos de payload para a cidade.
      let city = '';
      let countryCode = '';

      if (typeof location.payload === 'string') {
        // Lida com o caso de uma busca simples, onde o payload é apenas o nome da cidade.
        city = location.payload.trim();
      } else if (typeof location.payload === 'object' && location.payload !== null) {
        // Lida com o caso de uma busca precisa, com cidade e código do país.
        city = (location.payload.city || '').trim();
        countryCode = (location.payload.countryCode || '').trim();
      }

      // Impede uma requisição com nome de cidade vazio
      if (!city) {
        throw new Error("O nome da cidade não pode ser vazio.");
      }

      const query = countryCode ? `${city},${countryCode}` : city;
      weatherParams = { q: query, ...commonParams };
      forecastParams = { q: query, ...commonParams };
    } else {
      throw new Error("Tipo de localização inválido.");
    }

    // Usando o objeto 'params' do Axios para garantir a formatação correta da URL.
    const [weatherResponse, forecastResponse] = await Promise.all([
      axios.get(`${BASE_URL}/weather`, { params: weatherParams }),
      axios.get(`${BASE_URL}/forecast`, { params: forecastParams })
    ]);

    const weatherData = weatherResponse.data;
    const combinedData = {
      name: weatherData.name,
      current: {
        temp: weatherData.main?.temp,
        humidity: weatherData.main?.humidity,
        main: weatherData.weather?.[0]?.main,
        description: weatherData.weather?.[0]?.description,
        speed: weatherData.wind?.speed,
        sunrise: weatherData.sys?.sunrise,
        sunset: weatherData.sys?.sunset,
        clouds: weatherData.clouds?.all,
        coord: weatherData.coord,
      },
      daily: filterDailyForecast(forecastResponse.data.list)
    };

    return combinedData;

  } catch (error) {
    console.error("Erro ao buscar dados do tempo:", error.message);
    if (error.response) {
        if (error.response.status === 404) throw new Error('Cidade não encontrada.');
        if (error.response.status === 400) throw new Error('Requisição inválida. Verifique o nome da cidade.');
    }
    // Relança o erro para que a tela possa tratá-lo (ex: com um Alert)
    throw error;
  }
};

const filterDailyForecast = (list) => {
    const dailyData = {};
    list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyData[date]) {
            dailyData[date] = {
                dt: item.dt,
                temp: { min: item.main.temp_min, max: item.main.temp_max },
                weather: item.weather,
                pop: item.pop
            };
        } else {
            dailyData[date].temp.min = Math.min(dailyData[date].temp.min, item.main.temp_min);
            dailyData[date].temp.max = Math.max(dailyData[date].temp.max, item.main.temp_max);
            dailyData[date].pop = Math.max(dailyData[date].pop, item.pop);
        }
    });
    return Object.values(dailyData).slice(0, 5);
}
