import React, { useCallback } from "react"

import { useAuth } from "../context/AuthProvider"
import { invoke } from "../lib/axios"

/**
 * @typedef {Object} Film
 * @property {string} id - The film's ID.
 * @property {string} title - The film's title.
 * @property {string} overview - The film's overview.
 * @property {string} plotSummary - The film's plot summary.
 * @property {string} releaseDate - The film's release date.
 * @property {string} type - The film's type. Can be 'movie' or 'series'.
 */

/**
 * @typedef {Object} filmResponse
 * @property {Array<Film>} films - An array of film objects.
 * @property {() => Promise<void>} fetchFilms - A function to fetch the films.
 */

/**
 * @name useFilms
 * @description Hook to fetch films from the server.
 * @returns {filmResponse} A promise that resolves when the films have been fetched.
 */
function useFilms() {
  const { isAuthenticated } = useAuth()
  const [films, setFilms] = React.useState([])
  const [film, setFilm] = React.useState(null)
  const [isFetching, setIsFetching] = React.useState(false)

  const fetchFilms = useCallback(async () => {
    if (!isAuthenticated) return
    if (films.length > 0) return // prevent re-fetching if the films are already fetched
    setIsFetching(true)
    const response = await invoke({
      method: "GET",
      endpoint: "/film/all",
    })

    if (response?.error) {
      setIsFetching(false)
      console.error("Error- somethingis not right", response.error)
      return
    }

    setFilms(response?.res.films)
    setIsFetching(false)
  }, [isAuthenticated])

  const fetchFilm = useCallback(
    async (id) => {
      if (!id) return
      if (film?.id == id) return // prevent re-fetching if the film is already fetched

      setIsFetching(true)
      const response = await invoke({
        method: "GET",
        endpoint: `/film/${id}`,
      })

      if (response?.error) {
        setIsFetching(false)
        console.error("Error - something is not right", response.error)
        return
      }

      setFilm(response?.res?.film ?? null)
      setIsFetching(false)
    },
    [film?.id],
  )

  return { films, fetchFilms, film, fetchFilm, isFetching }
}

export default useFilms
