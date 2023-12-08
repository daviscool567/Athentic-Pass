import { FETCH_USER_DATA_REQUEST, RESET_USER_DATA, FETCH_USER_DATA_SUCCESS, FETCH_USER_DATA_FAILURE } from '../actions/actionTypes';

const initialState = {
  userLoading: 'false',
  userData: [],
  error: false,
  errorMessage: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_DATA_REQUEST:
      return {
        ...state,
        userLoading: 'true'
      };
    case FETCH_USER_DATA_SUCCESS:
      return {
        error: false,
        errorMessage: '',
        userData: action.payload,
        userLoading: 'done'
      };
    case RESET_USER_DATA:
      return {
        userLoading: 'done',
        userData: [],
        error: false,
        errorMessage: ''
      };
    case FETCH_USER_DATA_FAILURE:
      return {
        ...state,
        userLoading: 'done',
        error: true,
        errorMessage: action.payload
      };
    default:
      return state;
  }
};
