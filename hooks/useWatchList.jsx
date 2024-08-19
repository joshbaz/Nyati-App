import { useCallback, useEffect, useState } from "react"
import { useAuth } from "../context/AuthProvider"
import { invoke } from "../lib/axios"

/**
 * @typedef {Object} Returns
 * @property {boolean} loading - loading state
 * @property {Array} watchList - watchlist
 */

/**
 * @name useWatchList
 * @description custom hook to fetch watchlist
 * @param {{ limit: [number] }} options - limit of watchlist
 * @returns {Returns} - watchList and loading state
 */
function useWatchList({ limit }) {
  const { user } = useAuth()
  const [watchList, setWatchList] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchWatchList = useCallback(async () => {
    setLoading(true)
    try {
      const response = await invoke({
        endpoint: `/film/watchlist/${user?.id}?limit=${limit}`,
      })

      if (response.error) {
        setLoading(false)
        setWatchList([])
        return
      }

      setWatchList(response.res.watchlist || [])
    } catch (error) {
      setWatchList([])
    } finally {
      setLoading(false)
    }
  }, [limit, user?.id])

  useEffect(() => {
    fetchWatchList()
  }, [fetchWatchList])

  return { loading, watchList, fetchWatchList }
}

export default useWatchList
