import { set } from "date-fns"
import { router } from "expo-router"
import * as SecureStore from "expo-secure-store"
import { jwtDecode } from "jwt-decode"
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { invoke } from "../lib/axios"
import { Toast, useToast } from "./ToastProvider"

/**
 * @typedef {Object} AuthedUser
 * @property {string} id - The user's ID.
 * @property {string} firstname - The user's first name.
 * @property {string} lastname - The user's last name.
 * @property {string} email - The user's email address.
 */

/**
 * @typedef {Object} AuthContextType
 * @property {AuthedUser | null} user - The user object containing the user's information, or null if the user is not authenticated.
 * @property {boolean} loading - A boolean indicating whether the user is currently loading.
 * @property {boolean} isFetching - A boolean indicating whether the user is currently fetching.
 * @property {(params: {contact: string, isEmail: boolean, password: string}) => void} login - A function to log in the user.
 * @property {(token: string, fetchProfile?: boolean) => void} setToken - A function to set the user's authentication token.
 * @property {(id: [string]) => void} logout - A function to log out the user.
 * @property {(data: any) => void} updateUser - A function to update the user's information.
 * @property {boolean} isAuthenticated - A boolean indicating whether the user is authenticated.
 * @property {() => void} fetchUserProfile - A function to fetch the user's profile.
 * @property {()=> string} getAuthToken - A function to get the user's authentication token.
 * @property {string} userToken - The user's authentication token.
 */

/**
 * @name AuthContext
 * @description AuthContext is a React Context that provides the user's authentication state and functions to interact with the authentication system.
 * @type {React.Context<AuthContextType | undefined>}
 * @returns {React.Context<AuthContextType | undefined>}
 */
const AuthContext = createContext({
  user: null,
  loading: false,
  isFetching: false,
  login: () => {},
  logout: () => {},
  setToken: () => {},
  getAuthToken: () => "",
  updateUser: () => {},
  isAuthenticated: false,
  userToken: null,
})

function AuthProvider({ children }) {
  const { toast, showToast } = useToast()
  const [user, setUser] = useState(null)
  const [userToken, setUserToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [authError, setAuthError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const TOKEN_KEY = "_user_token"
  const endpoint = "/user"

  /**
   * @name setToken
   * @description Sets the user's authentication token in the secure store.
   * @param {string} token - The user's authentication token.
   * @returns Promise<void>
   */
  const setToken = async (token, fetchProfile = false) => {
    if (!token) return

    // check if the is a token in the secure store
    const existingToken = await SecureStore.getItemAsync(TOKEN_KEY)
    if (existingToken) {
      // if there is a token, delete it and replace it with the new token
      await SecureStore.deleteItemAsync(TOKEN_KEY)
    }

    await SecureStore.setItemAsync(TOKEN_KEY, token)

    // fetch the user's profile
    if (fetchProfile) {
      await fetchUserProfile()
    }
  }

  /**
   * @name getAuthToken
   * @description Fetches the user's authentication token from the secure store.
   * @returns string
   * */
  const getAuthToken = useCallback(async () => {
    return await SecureStore.getItemAsync(TOKEN_KEY)
  }, [TOKEN_KEY])

  /**
   *@name login
   * @description Logs in the user with the provided credentials.
   * @param {{
   *  contact: string;
   *  password: string;
   * }} credentials
   * @returns Promise<void>
   */
  const login = async (credentials) => {
    setLoading(true)

    if (!credentials) {
      setLoading(false)
      showToast({
        type: "error",
        message: "Please provide your credentials",
      })
      return
    }

    const response = await invoke({
      method: "POST",
      endpoint: `${endpoint}/login`,
      data: credentials,
    })

    if (response?.error) {
      setLoading(false)
      showToast({
        type: "error",
        message: response?.error?.message,
      })
      return
    }

    await SecureStore.setItemAsync(TOKEN_KEY, response?.res.token)
    setUserToken(response?.res.token)
    setUser(response?.res.user || null)
    setLoading(false)
    setIsAuthenticated(true)
  }

  /**
   * @name logout
   * @description Logs out the user.
   * @param {[string]} id - The user's ID.
   * @returns Promise<void>
   */
  const logout = useCallback(
    async (id = user?.id) => {
      try {
        setLoading(true)
        if (!id) return

        const response = await invoke({
          method: "POST",
          endpoint: `${endpoint}/logout/${id}`,
        })

        if (response?.error) {
          const err = new Error(response?.error.message)
          err.statusCode = response?.status
          throw err
        }

        await SecureStore.deleteItemAsync(TOKEN_KEY)

        setUser(null)
        setUserToken(null)
        setIsAuthenticated(false)
      } catch (error) {
        if ([401, 403, 404].includes(error.statusCode) && user?.id) {
          await SecureStore.deleteItemAsync(TOKEN_KEY)
          setIsAuthenticated(false)
          setUser(null)
          showToast({
            type: "error",
            message: "An authentication error occurred. Please try again.",
          })
          return
        }
        showToast({
          type: "error",
          message: error.message,
        })
      } finally {
        setLoading(false)
      }
    },
    [user?.id],
  )

  /**
   * @name fetchUserProfile
   * @description Fetches the user's profile from the server.
   * @returns Promise<void>
   */
  const fetchUserProfile = useCallback(async () => {
    const authToken = await SecureStore.getItemAsync(TOKEN_KEY)
    if (!authToken) {
      setIsAuthenticated(false)
      setIsFetching(false)
      return
    }

    // if we have a user id, but no token, log the user out
    if (!authToken && user?.id) {
      await logout(user?.id)
      return
    }

    // if we have a token and a user id set the user as authenticated
    if (authToken && user?.id) {
      setIsAuthenticated(true)
      setIsFetching(false)
      setUserToken(authToken)
      return
    }

    // if we have token and no user id, fetch the user's profile
    try {
      setIsFetching(true)

      const payload = jwtDecode(authToken)
      const response = await invoke({
        method: "GET",
        endpoint: `${endpoint}/me/${payload?.id}`,
      })

      if (response?.error) {
        const err = new Error(response?.error.message)
        err.statusCode = response?.status
        throw err
      }

      setIsAuthenticated(true)
      setUser(response?.res.user ?? null)
    } catch (error) {
      // if we get a 401, 403, or 404 error, delete the token and log the user out
      if ([401, 403, 404].includes(error.statusCode) && authToken) {
        await SecureStore.deleteItemAsync(TOKEN_KEY)
        setIsAuthenticated(false)
        setUser(null)
        return
      }

      showToast({
        type: "error",
        message: error?.message ?? "An error occurred. Please try again.",
      })
    } finally {
      setIsFetching(false)
    }
  }, [endpoint, user?.id, isAuthenticated])

  const updateUser = useCallback((data) => {
    if (!data) return
    setUser((prev) => ({ ...prev, ...data }))
  }, [])

  useEffect(() => {
    fetchUserProfile()
  }, [fetchUserProfile])

  useEffect(() => {
    if (authError) {
      setTimeout(() => {
        setAuthError(null)
      }, 5000) // 5 seconds
    }
  }, [authError])

  const memoizedChildren = React.useMemo(() => children, [children])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        setToken,
        userToken,
        isFetching,
        updateUser,
        getAuthToken,
        isAuthenticated,
        fetchUserProfile,
      }}
    >
      {memoizedChildren}
      <Toast toast={toast} />
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line
/**
 * @name useAuth
 * @description Hook to access the AuthContext.
 * @returns {AuthContextType} The AuthContext object.
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default AuthProvider
