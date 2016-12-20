import {
  FETCH_REQUEST,
  TIMELINE_EXPAND_SUCCESS,
  // TIMELINE_EXPAND_FAIL,
  // COMMENT_SUBMIT_REQUEST,
  // COMMENT_SUBMIT_SUCCESS,
  // COMMENT_SUBMIT_FAIL
} from 'constants';

const LOAD = 'jobs/LOAD';
const LOAD_SUCCESS = 'jobs/LOAD_SUCCESS';
const LOAD_FAIL = 'jobs/LOAD_FAIL';
// single
const LOAD_JOB = 'jobs/LOAD_JOB';
const LOAD_JOB_SUCCESS = 'jobs/LOAD_JOB_SUCCESS';
const LOAD_JOB_FAIL = 'jobs/LOAD_JOB_FAIL';

const EDIT_START = 'jobs/EDIT_START';
const EDIT_STOP = 'jobs/EDIT_STOP';
const SAVE = 'jobs/SAVE';
const SAVE_SUCCESS = 'jobs/SAVE_SUCCESS';
const SAVE_FAIL = 'jobs/SAVE_FAIL';
const CREATE = 'jobs/CREATE';
const CREATE_SUCCESS = 'jobs/CREATE_SUCCESS';
const CREATE_FAIL = 'jobs/CREATE_FAIL';

const initialState = {
  loaded: false,
  loadedFront: false,
  loadedJob: false,
  loadedMyJobs: false,
  editing: {},
  saveError: {},
  data: null,
  job: null,
  isFetching: false,
  isSaving: false,
  saved: false,
  isCreating: false,
  created: false,
  // job: Immutable.Map(),
  // jobs: Immutable.Map(),
  // home: Immutable.List([]),
  // savedJobs: Immutable.List([]),
  // me: Immutable.List([]),
  // ancestors: Immutable.Map(),
  // descendants: Immutable.Map(),
  // relationships: Immutable.Map()
};

function loadQuery(timeline, skip) {
  return {
    types: [LOAD, TIMELINE_EXPAND_SUCCESS, LOAD_FAIL],
    timeline,
    promise: (client) => client.get('/jobs/frontpage', { params: {skip: skip} }) // params not used, just shown as demonstration
  };
}

function loadMeQuery(timeline, skip) {
  return {
    types: [FETCH_REQUEST, TIMELINE_EXPAND_SUCCESS, LOAD_FAIL],
    timeline,
    promise: (client) => client.get('/me/jobs', { params: {skip: skip} }) // params not used, just shown as demonstration
  };
}


export function load(timeline) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    timeline,
    promise: (client) => client.get('/jobs/frontpage') // params not used, just shown as demonstration
  };
}

export function loadMore(timeline) {
  return (dispatch, getState) => {
    const skip = getState().data.home && getState().data.home.length;
    dispatch(loadQuery(
      timeline,
      skip
    ));
  };
}

export function get(id) {
  return {
    types: [LOAD_JOB, LOAD_JOB_SUCCESS, LOAD_JOB_FAIL],
    id,
    promise: (client) => client.get(`/jobs/get/${id}`) // params not used, just shown as demonstration
  };
}

export function loadMe(timeline) {
  return (dispatch, getState) => {
    const skip = getState().data.myJobs && getState().data.myJobs.length;
    return dispatch(loadMeQuery(
      timeline,
      skip
    ));
  };
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        loadedFront: true,
        home: action.result,
        error: null
      };
    case TIMELINE_EXPAND_SUCCESS:
      return {
        ...state,
        loading: false,
        home: [
          ...state.home,
          ...action.result
        ],
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: null,
        home: null,
        error: action.error
      };
    case LOAD_JOB:
      return {
        ...state,
        loading: true
      };
    case LOAD_JOB_SUCCESS:
      return {
        ...state,
        loading: false,
        loadedJob: true,
        job: action.result,
        error: null
      };
    case LOAD_JOB_FAIL:
      return {
        ...state,
        loading: false,
        loadedJob: false,
        job: null,
        error: action.error
      };
    case EDIT_START:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: true
        }
      };
    case EDIT_STOP:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: false
        }
      };
    case SAVE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      const data = [...state.data];
      data[action.result.id - 1] = action.result;
      return {
        ...state,
        data: data,
        editing: {
          ...state.editing,
          [action.id]: false
        },
        saveError: {
          ...state.saveError,
          [action.id]: null
        }
      };
    case SAVE_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: {
          ...state.saveError,
          [action.id]: action.error
        }
      } : state;
    case CREATE:
      return {
        ...state,
        isCreating: true
      };
    case CREATE_SUCCESS:
      return {
        ...state,
        isCreating: false,
        created: true,
        job: action.result
      };
    case CREATE_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        createError: action.error,
        isCreating: false,
        created: false,
      } : state;
    default:
      return state;
  }
}

export function isFrontLoaded(globalState) {
  return globalState.data && globalState.data.loadedFront;
}

export function isLoaded(globalState) {
  return globalState.data && globalState.data.loadedMyJobs;
}

export function isJobLoaded(globalState) {
  return globalState.data && globalState.data.loadedJob;
}

// job

export function create(job) {
  return {
    types: [CREATE, CREATE_SUCCESS, CREATE_FAIL],
    promise: (client) => client.post('/jobs/create', {
      data: job
    })
  };
}

export function save(widget) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: widget.id,
    promise: (client) => client.post('/widget/update', {
      data: widget
    })
  };
}

export function editStart(id) {
  return { type: EDIT_START, id };
}

export function editStop(id) {
  return { type: EDIT_STOP, id };
}
