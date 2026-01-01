import axios from 'axios';

const HttpClient = axios.create({
  baseURL: 'http://localhost:5071',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default HttpClient;