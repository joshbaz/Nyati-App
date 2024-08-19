import { useCallback, useEffect, useMemo, useState } from "react"
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
 * @param {{ limit: [number], filters: { type: [string]} }} options - limit of watchlist
 * @returns {Returns} - watchList and loading state
 */
function useWatchList({ limit, filters }) {
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

  const filteredWatchList = useMemo(() => {
    if (!watchList.length) return []
    if (!filters?.type) return watchList

    return watchList.filter((item) => item.type === filters.type)
  }, [watchList, filters?.type])

  useEffect(() => {
    fetchWatchList()
  }, [fetchWatchList])

  return { loading, watchList: filteredWatchList, fetchWatchList }
}

export default useWatchList
