import { FETCH_CONCERT_DATA, SET_SEARCH_TERM, SET_SEARCH_COST, SET_CONCERTS_COST_MIN, SET_CONCERTS_COST_MAX, IS_COST_SPECIFIED, SET_FILTERED_CONCERTS } from './actions';
import get from './utilities/axiosHelpers.js';
import { sortByDate, findMinMax, filteredMatches } from './utilities/filterHelpers';

export const setConcertData = (concertData) => ({
  type: FETCH_CONCERT_DATA, concertData
})

export function fetchConcertData (url) {
  return function (dispatch) {
    get(url, (data) => {
        dispatch(setConcertData(data))
        dispatch(setConcertsCostMin(data.concerts))
        dispatch(setConcertsCostMax(data.concerts))
        dispatch(setSearchCost(findMinMax(data.concerts)[1]))
    })
  }
};

export const setSearchTerm = (searchTerm) => ({
  type: SET_SEARCH_TERM, searchTerm
})

export function setFilteredConcerts (filteredConcertData) {
  return { type: SET_FILTERED_CONCERTS, filteredConcertData }
}

function batchActions(...actions) {
  return {
    typs: 'BATCH_ACTIONS',
    actions: actions,
  };
}

function enableBatching(reducer) {
  return function batchingReducer(state, action) {
    switch (action.type) {
      case 'BATCH_ACTIONS':
        return action.actions.reduce(reducer,state);
      default: reducer(action, state);
    }
  }
}

export function handleSearch (searchTerm, costSearch) {
  return function (dispatch, getState) {
    batchActions(
      dispatch(setSearchTerm(searchTerm)),
      dispatch(setFilteredConcerts(filteredMatches(getState().concertData, searchTerm, costSearch)))
    )
    if (searchTerm !== '') {
      batchActions(
        dispatch(setConcertsCostMin(getState().filteredConcerts)),
        dispatch(setConcertsCostMax(getState().filteredConcerts))
      )
    }
  }
}
// export function handleSearch (searchTerm, costSearch) {
//   return function (dispatch, getState) {
//     dispatch(setSearchTerm(searchTerm))
//     dispatch(setFilteredConcerts(filteredMatches(getState().concertData, searchTerm, costSearch)))
//     if (searchTerm !== '') {
//       dispatch(setConcertsCostMin(getState().filteredConcerts))
//       dispatch(setConcertsCostMax(getState().filteredConcerts))
//     }
//   }
// }

export function setSearchCost (searchCost) {
  return { type: SET_SEARCH_COST, searchCost }
}

export function setConcertsCostMin (concerts) {
  const min = findMinMax(concerts)[0]
  return { type: SET_CONCERTS_COST_MIN, min }
}

export function setConcertsCostMax (concerts) {
  const max = findMinMax(concerts)[1]
  return { type: SET_CONCERTS_COST_MAX, max }
}
export function isCostSpecified (bool) {
  return { type: IS_COST_SPECIFIED, bool }
}
