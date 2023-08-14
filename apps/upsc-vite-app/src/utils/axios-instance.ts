import axios from "axios";

const instance = axios.create({
  // baseURL: "http://3.111.124.200:3000",
  baseURL: "http://localhost:3000",
  timeout: 30000,
});

export default instance;
