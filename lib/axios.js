import * as SecureStore from "expo-secure-store"
import axios, { AxiosError } from "axios"

export const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "Access-Control-Allow-Origin": process.env.EXPO_PUBLIC_API_URL,
  "Access-Control-Allow-Credentials": "true",
}

export async function invoke({ method, endpoint, data, isStream, options }) {
  const config = {
    headers,
  }

  const TOKEN_KEY = "_user_token"
  const token = await SecureStore.getItemAsync(TOKEN_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (isStream) {
    config.headers.Range = "bytes=0-"
  }

  const baseUrl = `${process.env.EXPO_PUBLIC_API_URL}/api/v1`
  const requestURL = `${baseUrl}${endpoint}`

  const { headers: optionHeaders, ...opts } = options || {}
  try {
    const {
      data: res,
      status,
      headers,
    } = await axios({
      method,
      url: requestURL,
      data,
      headers: {
        ...config.headers,
        ...optionHeaders,
      },
      withCredentials: true,
      ...opts,
    })

    return { res, headers, status, error: null }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error?.response) {
        console.error("error", error.response.status)
        if (error.response.data.message) {
          return {
            res: null,
            headers: error.response.headers,
            status: error.response.status,
            error: new Error(error.response.data.message),
          }
        }

        return {
          res: null,
          status: error.response.status,
          error: error.response.data,
        }
      } else if (error.request) {
        return {
          res: null,
          headers: error.response?.headers,
          status: error.response?.status,
          error: "Error: No response received from the request",
        }
      } else {
        return {
          res: null,
          headers: error.response?.headers,
          status: error.response?.status,
          error: error.message,
        }
      }
    }
  }
}
