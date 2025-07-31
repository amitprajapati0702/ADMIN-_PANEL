import axios from "axios";
// import { BASE_URL } from "../config/config";
import { toast } from "react-toastify";
const authKey = process.env.REACT_APP_AUTHORIZATION_KEY;
const BASE_URL = process.env.REACT_APP_URL;

const instance = axios.create({
  baseURL: BASE_URL,
});

instance.interceptors.response.use(
  (response) => {
      return response;
  },
  (error) => {
      return error?.response?.data;
  }
);

instance.interceptors.request.use((config) => {
  config.headers["Accept"] = "application/json";
  config.headers["Content-Type"] = "application/json";
  config.headers["Authorization"] = `Basic ${authKey}`;
  config.headers["accessToken"] = localStorage.getItem("accessToken") || "";
  return config;
});

const API = instance;

export default API;
