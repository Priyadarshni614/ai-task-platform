import axios from "axios";

const API = axios.create({
  baseURL: "http://backend:5000/api",
});

export default API;