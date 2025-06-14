import axios from 'axios';

const COIN_KEY = import.meta.env.VITE_GECKO_API_KEY;
const BASE_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=100&page=1';


export const fetchCoins = async () => {
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        accept: 'application/json',
        'X-CoinAPI-Key': COIN_KEY
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching coins:', err);
    throw err;
  }
};

// Currency services

const CURRENCY_API_KEY = import.meta.env.VITE_FREECURRENCY_API_KEY;
const BASE_URL_CURRENCY = "https://api.freecurrencyapi.com/v1";

export async function fetchCurrencies() {
  try {
    const res = await axios.get(`${BASE_URL_CURRENCY}/currencies?apikey=${CURRENCY_API_KEY}`);
    return Object.values(res.data.data)
  } catch (err) {
    console.error('Error fetching currencies:', err);
    throw err;
  }
}

export async function fetchExchangeRate(base) {
  try {
    const res = await axios.get(`${BASE_URL_CURRENCY}/latest?apikey=${CURRENCY_API_KEY}&base_currency=${base}`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw error;
    
  }
}

export function getCurrencyImageUrl(code) {
  return `https://wise.com/public-resources/assets/flags/rectangle/${code.toLowerCase()}.png`;
}


// Finance news services

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const NEWS_BASE_URL = "https://newsapi.org/v2/everything";


export async function fetchBusinessNews({ q = "bitcoin" } = {}) {
  const url = `${NEWS_BASE_URL}?q=${q}&apiKey=${NEWS_API_KEY}`;

  try {
    const response = await axios.get(url);
    return response.data.articles;
  } catch (error) {
    throw new Error("Error fetching news: " + error.message);
  }
}


