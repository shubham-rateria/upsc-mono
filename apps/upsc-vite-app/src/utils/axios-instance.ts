import axios from "axios";

//  "http://3.111.124.200:3000"

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "http://api.upscsmartnotes.com:3000"
      : "http://api.upscsmartnotes.com:3000",
  // baseURL: "http://localhost:3000",
  timeout: 120000,
});

export default instance;
