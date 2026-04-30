import axios from 'axios';
// Just one variable for the whole project
const api = axios.create({
  baseURL: 'https://honduras-archive-2v.onrender.com/api' 
});
export default api;