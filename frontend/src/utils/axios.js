import axios from "axios";


const fetchAxios = axios.create({
  baseURL: process.env.REACT_APP_ECOMMERCE_URL,
});


export default fetchAxios;

