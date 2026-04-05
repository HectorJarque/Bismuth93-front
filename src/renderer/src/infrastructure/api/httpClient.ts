import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8765'

export const httpClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

httpClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API Error]', err.response?.status, err.response?.data ?? err.message)
    return Promise.reject(err)
  }
)

export const ATTACHMENT_BASE = BASE_URL
