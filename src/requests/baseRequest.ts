import axios from "axios";

export const weatherInsAxios = axios.create({
  baseURL: '/api'
});
