import { set } from "date-fns"
import { useRootNavigationState, useRouter } from "expo-router"
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
import Toast from "react-native-root-toast"
import { invoke } from "../lib/axios"

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
 * @property {boolean} fetching - A boolean indicating whether the user is currently fetching.
 * @property {() => void} login - A function to log in the user.
 * @property {() => void} logout - A function to log out the user.
 * @property {boolean} isAuthenticated - A boolean indicating whether the user is authenticated.
 */

/**
 * @name AuthContext
 * @description AuthContext is a React Context that provides the user's authentication state and functions to interact with the authentication system.
 * @type {React.Context<AuthContextType | undefined>}
 */
const AuthContext = createContext({
  user: null,
  loading: false,
  fetching: false,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
})

function showToast(message) {
  Toast.show(message, {
    duration: Toast.durations.SHORT,
  })
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [authError, setAuthError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const router = useRouter()

  const TOKEN_KEY = "_user_token"
  const endpoint = "/user"

  /**
   *@name login
   * @description Logs in the user with the provided credentials.
   * @param {{
   *  email: string;
   *  password: string;
   * }} credentials
   * @returns Promise<void>
   */
  const login = async (credentials) => {
    setLoading(true)

    const authToken = await SecureStore.getItemAsync(TOKEN_KEY)
    // if auth token exists, fetch the admin profile check expiration
    if (authToken) {
      const payload = jwtDecode(authToken)
      if (payload?.exp && Date.now() >= payload?.exp * 1000) {
        await logout(payload?.id)
        setLoading(false)
        setUser(null)
        router.push("auth/login")
        showToast("Your session has expired. Please log in again.")
        return
      }
      // if auth token exists no need to relogin
      return
    }

    const response = await invoke({
      method: "POST",
      endpoint: `${endpoint}/login`,
      data: credentials,
    })

    if (response?.error) {
      setLoading(false)
      showToast(response?.error?.message)
      return
    }

    await SecureStore.setItemAsync(TOKEN_KEY, response?.res.token)
    setUser(response?.res.user || null)
    setLoading(false)
    setIsAuthenticated(true)
    // router.push("home")
  }

  /**
   * @name logout
   * @description Logs out the user.
   * @param {string} id - The user's ID.
   * @returns Promise<void>
   */
  const logout = async (id = user?.id) => {
    setLoading(true)
    if (!id) return

    const response = await invoke({
      method: "POST",
      endpoint: `${endpoint}/logout/${id}`,
    })

    if (response?.error) {
      setLoading(false)
      showToast(response?.error?.message)
      return
    }

    await SecureStore.deleteItemAsync(TOKEN_KEY)
    setUser(null)
    setLoading(false)
    setIsAuthenticated(false)
    router.replace("/")
  }

  /**
   * @name fetchUserProfile
   * @description Fetches the user's profile from the server.
   * @returns Promise<void>
   */
  const fetchUserProfile = useCallback(async () => {
    const authToken = await SecureStore.getItemAsync(TOKEN_KEY)
    if (!authToken) {
      setIsAuthenticated(false)
      showToast("An authentication error occurred. Please try again.")
      return
    }

    setIsFetching(true)

    if (user?.id) {
      setIsFetching(false)
      setIsAuthenticated(true)
      return
    }

    const payload = jwtDecode(authToken)
    const response = await invoke({
      method: "GET",
      endpoint: `${endpoint}/me/${payload?.id}`,
    })

    if (response?.error) {
      setIsFetching(false)
      if ([401, 403].includes(response?.status) && authToken) {
        await SecureStore.deleteItemAsync(TOKEN_KEY)
        showToast("An authentication error occurred. Please try again.")
        return
      }
      showToast(response?.error?.message)
      setIsAuthenticated(false)
      return
    }

    setIsAuthenticated(true)
    setUser(response?.res.user)
    setIsFetching(false)
  }, [endpoint, user?.id])

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

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isFetching,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line
/**
 * @name useAuth
 * @description Hook to access the AuthContext.
 * @returns {AuthContextType | undefined} The AuthContext object.
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    showToast("useAuth must be used within an AuthProvider")
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default AuthProvider
