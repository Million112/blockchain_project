import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // backend bạn

export const login = async (username, password) => {
  const res = await axios.post(`${API_URL}/login`, { username, password });
  return res.data; // { token, role, username }
};
