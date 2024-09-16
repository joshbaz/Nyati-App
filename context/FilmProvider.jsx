import React, { createContext, useContext } from "react"
import useFilms from "../hooks/useFilms"

/**
 * @name FilmContext
 * @description Film context
 * @type {React.Context<import("../hooks/useFilms").filmResponse>}
 * @returns {React.Context<import("../hooks/useFilms").filmResponse>}
 * */

const FilmContext = createContext({
  film: null,
  films: [],
  fetchFilms: () => {},
  fetchFilm: () => {},
  isFetching: false,
})

function FilmProvider({ children }) {
  // states
  const filmsctx = useFilms()
  const memoizedChildren = React.useMemo(() => children, [children])

  return (
    <FilmContext.Provider value={{ ...filmsctx }}>
      {memoizedChildren}
    </FilmContext.Provider>
  )
}

export function useFilmCtx() {
  const context = useContext(FilmContext)
  if (!context) {
    throw new Error("useFilmCtx must be used within a MembershipProvider")
  }
  return context
}

export default FilmProvider
