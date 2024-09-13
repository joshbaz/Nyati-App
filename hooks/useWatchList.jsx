import { useCallback, useEffect, useMemo, useState } from "react"
import { useAuth } from "../context/AuthProvider"
import { useToast } from "../context/ToastProvider"
import { invoke } from "../lib/axios"

/**
 * @typedef {Object} item
 * @property {"movie" | "series"} type - type of film
 * @property {string} id - film id
 * @property {string} title - film title
 * @property {{
 *  id: string,
 *  type: string,
 *  url: string,
 *  isCover: boolean,
 *  isBackdrop: boolean,
 *  filmId: string,
 * }} poster - film poster
 * @property {string} releaseDate - film release date
 *
 */

/**
 * @typedef {Object} Returns
 * @property {boolean} loading - loading state
 * @property {{ saved: item[], purchased: item[] }} watchList - watchlist
 * @property {()=> void} fetchWatchList - fetch watchlist
 * @property {(param: string)=> void} handleAddToWatchlist - add to watchlist
 */

/**
 * @name useWatchList
 * @description custom hook to fetch watchlist
 * @param {{ limit: [number], filters: { type: [string]}, disableFetch: boolean }} options - limit of watchlist
 * @returns {Returns} - watchList and loading state
 */
function useWatchList({ limit, filters, disableFetch = false }) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [watchList, setWatchList] = useState({
    saved: [],
    purchased: [],
  })
  const [loading, setLoading] = useState(false)

  const fetchWatchList = useCallback(async () => {
    if (disableFetch || !user?.id) return // cancel fetching on mount
    try {
      setLoading(true)
      const response = await invoke({
        endpoint: `/film/watchlist/${user?.id}?limit=${limit}`,
      })

      if (response.error) {
        throw new Error(response.error)
      }
      setWatchList({
        saved: response.res.watchlist?.SAVED || [],
        purchased: response.res.watchlist?.PURCHASED || [],
      })
    } catch (error) {
      setWatchList((prev) => prev) // set to previous state
    } finally {
      setLoading(false)
    }
  }, [limit, user?.id, disableFetch])

  const filteredWatchList = useMemo(() => {
    if (!filters?.type) return watchList

    return {
      saved:
        watchList.saved.length > 0
          ? watchList.saved.filter((item) => item.type === filters.type)
          : [],
      purchased:
        watchList.purchased.length > 0
          ? watchList.purchased.filter((item) => item.type === filters.type)
          : [],
    }
  }, [watchList.purchased, watchList.saved, filters?.type])

  /**
   * @name handleAddToWatchlist
   * @description function to add film to watchlist
   * @param {string} filmId
   * @returns {Promise<void>}
   * */

  const handleAddToWatchlist = useCallback(
    /**
     * @param {string} filmId
     * @param {(filmId: string)} cb
     * @returns {Promise<void>}
     */
    async (filmId, cb) => {
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
        if (typeof cb === "function") cb(filmId)
      } catch (error) {
        showToast({
          type: "error",
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
    fetchWatchList,
    handleAddToWatchlist,
    watchList: filteredWatchList,
  }
}

export default useWatchList
