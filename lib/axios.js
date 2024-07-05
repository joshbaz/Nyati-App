import axios, { AxiosError } from "axios"

export async function invoke({ method, endpoint, data, isStream, options }) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": process.env.EXPO_PUBLIC_API_URL,
      "Access-Control-Allow-Credentials": "true",
    },
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

    console.log(res)

    return { res, headers, status, error: null }
  } catch (error) {
    console.log(error)
    if (error instanceof AxiosError) {
      if (error?.response) {
        if (error.response.data.message) {
          return {
            res: null,
            headers: error.response.headers,
            status: 500,
            error: new Error(error.response.data.message),
          }
        }

        return { res: null, status: 500, error: error.response.data }
      } else if (error.request) {
        return {
          res: null,
          headers: error.response?.headers,
          status: 500,
          error: "Error: No response received from the request",
        }
      } else {
        return {
          res: null,
          headers: error.response?.headers,
          status: 500,
          error: error.message,
        }
      }
    }
  }
}
