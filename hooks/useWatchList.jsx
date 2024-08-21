import { useCallback, useEffect, useMemo, useState } from "react"
import { useAuth } from "../context/AuthProvider"
import { useToast } from "../context/ToastProvider"
import { invoke } from "../lib/axios"

/**
 * @typedef {Object} Returns
 * @property {boolean} loading - loading state
 * @property {Array} watchList - watchlist
 * @property {Function} fetchWatchList - fetch watchlist
 * @property {Function} handleAddToWatchlist - add to watchlist
 */

/**
 * @name useWatchList
 * @description custom hook to fetch watchlist
 * @param {{ limit: [number], filters: { type: [string]}, disableFetch: boolean }} options - limit of watchlist
 * @returns {Returns} - watchList and loading state
 */
function useWatchList({ limit, filters, disableFetch }) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [watchList, setWatchList] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchWatchList = useCallback(async () => {
    if (disableFetch) return // cancel fetching on mount
    try {
      setLoading(true)
      const response = await invoke({
        endpoint: `/film/watchlist/${user?.id}?limit=${limit}`,
      })

      if (response.error) {
        throw new Error(response.error)
      }
      setWatchList(response.res.watchlist || [])
    } catch (error) {
      setWatchList([])
    } finally {
      setLoading(false)
    }
  }, [limit, user?.id, disableFetch])

  const filteredWatchList = useMemo(() => {
    if (!watchList.length) return []
    if (!filters?.type) return watchList

    return watchList.filter((item) => item.type === filters.type)
  }, [watchList, filters?.type])

  const handleAddToWatchlist = useCallback(
    /**
     * @param {string} filmId
     * @returns {Promise<void>}
     */
    async (filmId) => {
      try {
        setLoading(true)
        const response = await invoke({
          method: "POST",
          endpoint: `/film/watchlist/${filmId}/${user?.id}`,
        })

        if (response.error) {
          throw new Error(response.error)
        }
        showToast({
          type: "success",
          message: "Added to watchlist",
        })
      } catch (error) {
        showToast({
          type: "danger",
          message: "Unable to add to watchlist",
        })
      } finally {
        setLoading(false)
      }
    },
    [user?.id, showToast],
  )

  useEffect(() => {
    fetchWatchList()
  }, [fetchWatchList])

  return {
    loading,
    watchList: filteredWatchList,
    fetchWatchList,
    handleAddToWatchlist,
  }
}

export default useWatchList
