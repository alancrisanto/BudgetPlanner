import axios from 'axios';


const API_URL = 'http://localhost:5001/api/auth/';
// Register user
export const registerRequest = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.user.email));
  }
  return response.data;
}

export const loginRequest = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify({
      email: response.data.user.email,
      token: response.data.token
    }));
  }
  return response.data;
}
