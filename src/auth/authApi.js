import axios from "axios";

const BASE_URL = "http://localhost:8080/api/admin";

export const loginApi = (data) => axios.post(`${BASE_URL}/login`, data);
export const registerApi = (data) => axios.post(`${BASE_URL}/register`, data);
