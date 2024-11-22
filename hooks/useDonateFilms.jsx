import { useCallback, useEffect, useState } from "react"
import { invoke } from "../lib/axios"

/**
 * @typedef {Object} Returns
 * @property {import("./useFilms").Film[]} films - films
 * @property {boolean} loading - loading state
 * @property {import("./useFilms").Film} film - film
 * @property {(id: string) => Promise<void>} getDonateFilm - function to get a film
 * @property {() => Promise<void>} fetchDonateFilms - function to fetch films
 */

/**
 * @name useDonateFilms
 * @description Hook to fetch films allow donation towards them.
 * @param {boolean} disableFetch
 * @returns {Returns} - films, loading, film, getDonateFilm
 */

function useDonateFilms(disableFetch = false) {
  const [films, setFilms] = useState([])
  const [film, setFilm] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchDonateFilms = useCallback(async () => {
    if (disableFetch) return // prevent fetching if disabled
    try {
      setLoading(true)
      const response = await invoke({
        method: "GET",
        endpoint: "/film/all?donation=true",
      })

      if (response?.error) {
        throw new Error(response.error)
      }

      setFilms(response?.res?.films ?? [])
    } catch (error) {
      console.error("Error - something is not right", error)
      setFilms([])
    } finally {
      setLoading(false)
    }
  }, [disableFetch])

  /**
   * @name getDonateFilm
   * @description function to get a film
   */
  const getDonateFilm = useCallback(
    /**
     * @param {string} id - film id
     * @returns {Promise<void>}
     */
    async (id) => {
      try {
        setLoading(true)
        const response = await invoke({
          method: "GET",
          endpoint: `/film/${id}?donation=true`,
        })

        if (response?.error) {
          throw new Error(response.error)
        }

        setFilm(response?.res?.film ?? null)
      } catch (error) {
        console.error("Error - something is not right", error)
        setFilm(null)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  // fetch films on mount
  useEffect(() => {
    fetchDonateFilms()
  }, [fetchDonateFilms])

  return { films, loading, film, getDonateFilm, fetchDonateFilms }
}

export default useDonateFilms
