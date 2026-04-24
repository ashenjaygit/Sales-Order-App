import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5246/api', // Adjust base URL later if different
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
