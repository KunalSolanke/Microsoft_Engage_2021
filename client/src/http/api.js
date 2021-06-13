import axios from 'axios';
export const env = process.env.REACT_APP_ENV||"dev";
const baseURL =
    env == "dev"
        ? 'http://localhost:5000'
        : 'https://interview-tracker-iitg.herokuapp.com';

const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        credentials: 'include',
    },
});

export default axiosInstance;
