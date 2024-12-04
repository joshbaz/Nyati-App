import { set } from "date-fns"
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
 * @property {Film} film - A film object.
 * @property {Array<Film>} films - An array of film objects.
 * @property {() => void} fetchFilms - A function to fetch the films.
 * @property {(id: string) => void} fetchFilm - A function to fetch a single film.
 * @property {boolean} isFetching - A boolean indicating whether the films are currently being fetched.
 * @property {(filmId: string, likeType: "THUMBS_UP" | "THUMBS_DOWN" | "NONE") => void} likeRateFilm - A function to like or rate a film.
 * @property {Object} season - A season object.
 * @property {() => void} fetchSeason - A function to fetch the season.
 * @property {(seasonId: string) => void} selectSeason - A function to select a season.
 * @property {Object} episode - An episode object.
 * @property {(episodeId: string) => void} selectEpisode - A function to select an episode
 */

/**
 * @name useFilms
 * @description Hook to fetch films from the server.
 * @returns {filmResponse} A promise that resolves when the films have been fetched.
 */
function useFilms() {
  const { isAuthenticated, user } = useAuth()
  const [films, setFilms] = React.useState([])
  const [film, setFilm] = React.useState(null)
  const [season, setSeason] = React.useState(null)
  const [episode, setEpisode] = React.useState(null)
  const [isFetching, setIsFetching] = React.useState(false)

  const fetchFilms = useCallback(async () => {
    if (!isAuthenticated) return
    if (films.length > 0) return // prevent re-fetching if the films are already fetched
    try {
      setIsFetching(true)
      const response = await invoke({
        method: "GET",
        endpoint: "/film/all",
      })

      if (response?.error) {
        throw new Error(response.error.message)
      }

      setFilms(response?.res.films)
    } catch (error) {
      setFilms((prev) => prev)
    } finally {
      setIsFetching(false)
    }
  }, [isAuthenticated])

  const fetchFilm = useCallback(
    async (id) => {
      if (!id) return
      if (id !== film?.id) {
        setIsFetching(true)
      }

      try {
        const response = await invoke({
          method: "GET",
          endpoint: `/film/${id}`,
        })

        if (response?.error) {
          const error = new Error(response.error.message)
          throw error
        }

        setFilm(response?.res.film)
      } catch (error) {
        setFilm((prev) => prev)
      } finally {
        setIsFetching(false)
      }
    },
    [film?.id],
  )

  const likeRateFilm = useCallback(
    /**
     * @param {string} filmId
     * @param {"THUMBS_UP" | "THUMBS_DOWN" | "NONE"} likeType
     */
    async (filmId, likeType = "NONE") => {
      try {
        if (!user?.id || !filmId) return
        const response = await invoke({
          method: "PUT",
          endpoint: `/film/likerate/${filmId}/${user.id}`,
          data: { likeType },
        })

        if (response?.error) {
          throw new Error(response.error.message)
        }

        fetchFilm(filmId)
      } catch (error) {
        console.error(error)
      }
    },
    [user?.id],
  )

  const fetchSeason = useCallback(
    /**
     * @param {string} filmId
     */
    (filmId) => {
      if (!film) {
        // fetch the film first
        fetchFilm(filmId)
      }

      if (film?.season?.length > 0) {
        setSeason(film?.season[0] ?? null)
      }
    },
    [film, fetchFilm],
  )

  const selectSeason = useCallback(
    /**
     * @param {string} seasonId
     */
    (seasonId) => {
      if (!film) throw new Error("Film is required")
      if (film?.type !== "series") throw new Error("Film must be a series")
      if (film?.season?.length === 0) throw new Error("Film has no season")

      const selectedSeason = film?.season?.find((s) => s.id === seasonId)
      setSeason(selectedSeason)
    },
    [film],
  )

  const selectEpisode = useCallback(
    (episodeId) => {
      if (!season) throw new Error("Season is required")
      if (season?.episodes?.length === 0)
        throw new Error("Season has no episode")

      const selectedEpisode = season?.episodes?.find(
        (ep) => ep.id === episodeId,
      )
      setEpisode(selectedEpisode)
    },
    [season],
  )

  return {
    films,
    fetchFilms,
    film,
    fetchFilm,
    isFetching,
    likeRateFilm,
    season,
    fetchSeason,
    selectSeason,
    episode,
    selectEpisode,
  }
}

export default useFilms
