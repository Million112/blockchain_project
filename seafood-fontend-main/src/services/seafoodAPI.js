import axios from "axios";
const API = "http://localhost:5000/api";

export const getAllSeafoods = () => axios.get(`${API}/seafood`);
export const addCatch = (data) => axios.post(`${API}/fisherman/addCatch`, data);
export const addProcess = (data) => axios.post(`${API}/processor/addProcess`, data);
export const addTransport = (data) => axios.post(`${API}/transporter/addTransport`, data);
export const receiveSeafood = (data) => axios.post(`${API}/retailer/receive`, data);
export const sellSeafood = (data) => axios.post(`${API}/retailer/sell`, data);
export const getHistory = (id) => axios.get(`${API}/seafood/${id}/history`);
