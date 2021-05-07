import { LOCATION_CHANGE } from './actions'

const createConnectRouter = (structure) => {
  const {
    filterNotRouter,
    fromJS,
    getIn,
    merge,
    setIn,
  } = structure
  /**
   * This reducer will update the state with the most recent location history
   * has transitioned to.
   */
  const routerReducer = (state, { type, payload } = {}) => {
    if (type === LOCATION_CHANGE) {
      const { location, action, isFirstRendering } = payload
        // Don't update the state ref for the first rendering
        // to prevent the double-rendering issue on initilization
        return isFirstRendering
          ? state
          : merge(state, { location: fromJS(location), action })
    }

    return state
  }

  const connectRouter = (history) => {
    const initialRouterState = fromJS({
      location: history.location,
      action: history.action,
    })
    // Wrap a root reducer and return a new root reducer with router state
    return (rootReducer) => (state, action) => {
      let routerState = initialRouterState

      // Extract router state
      if (state) {
        routerState = getIn(state, ['router']) || routerState
        state = filterNotRouter(state)
      }
      const reducerResults = rootReducer(state, action)

      return setIn(reducerResults, ['router'], routerReducer(routerState, action))
    }
  }

  return connectRouter
}

export default createConnectRouter
