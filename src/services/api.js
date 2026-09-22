import axios from 'axios'

const api = axios.create({
  baseURL: 'https://care-flow-zz8i.onrender.com/api',
})

export default api