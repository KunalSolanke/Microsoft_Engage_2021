import axios from "axios";
export const env = process.env.REACT_APP_ENV;
const backend = ["https://connect-engage.herokuapp.com", "https://engage-backend.voldemort.wtf"];
export const baseURL =
  env == "dev" ? "http://localhost:5000" : backend[parseInt(process.env.REACT_APP_BACKEND)];

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    credentials: "include",
  },
});

export default axiosInstance;
