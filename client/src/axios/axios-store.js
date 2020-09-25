import axios from "axios";

if (process.env.REACT_APP_API_URL) {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL;
} else {
  axios.defaults.baseURL =
    process.env.NODE_ENV === "development" ? "http://localhost:5000" : "";
}

export default axios;
