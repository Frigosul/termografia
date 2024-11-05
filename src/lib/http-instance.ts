import axios from "axios"
import https from 'node:https'
const credentials = btoa(`${process.env.API_USER}:${process.env.API_PASSWORD}`)

export const httpInstance = axios.create({
  headers: {
    Authorization: `Basic ${credentials}`
  },
  httpsAgent: new https.Agent({ keepAlive: true, rejectUnauthorized: false }),
  proxy: undefined

})
httpInstance.defaults.baseURL = process.env.BASE_URL