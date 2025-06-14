import axios from 'axios';

const COIN_KEY = import.meta.env.GECKO_API_KEY;
const BASE_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=100&page=1';
const BASE_URL_CURRENCY = "https://api.freecurrencyapi.com/v1";
const CURRENCY_API_KEY = import.meta.env.VITE_FREECURRENCY_API_KEY;

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




export async function fetchCurrencies() {
  try {
    const res = await axios.get(`${BASE_URL_CURRENCY}/currencies?apikey=${CURRENCY_API_KEY}`);
    console.log('Currencies:', res);
    return Object.values(res.data.data)
  } catch (err) {
    console.error('Error fetching currencies:', err);
    throw err;
  }
}

export async function fetchExchangeRate(base) {
  try {
    const res = await axios.get(`${BASE_URL_CURRENCY}/latest?apikey=${CURRENCY_API_KEY}&base_currency=${base}`);
    console.log('Exchange rates:', res);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw error;
    
  }
}

export function getCurrencyImageUrl(code) {
  return `https://wise.com/public-resources/assets/flags/rectangle/${code.toLowerCase()}.png`;
}
