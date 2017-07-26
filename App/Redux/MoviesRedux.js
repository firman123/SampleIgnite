import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  moviesRequest: null,
  moviesSuccess: ['data'],
  moviesFailure: ['error']
})

export const MoviesTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  payload: null,
  error: null
})

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state) =>
  state.merge({ fetching: true, payload: null })

// successful api lookup
export const success = (state, { data }) => {
  return state.merge({ fetching: false, error: null, data })
}

// Something went wrong somewhere.
export const failure = (state, { error }) =>
   state.merge({ fetching: false, error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.MOVIES_REQUEST]: request,
  [Types.MOVIES_SUCCESS]: success,
  [Types.MOVIES_FAILURE]: failure
})
