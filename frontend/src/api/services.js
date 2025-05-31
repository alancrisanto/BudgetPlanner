import axios from 'axios';

const COIN_KEY = import.meta.env.GECKO_API_KEY;
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