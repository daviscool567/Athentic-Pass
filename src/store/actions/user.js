import axios from 'axios';

export const fetchUserDataRequest = () => ({ type: "FETCH_USER_DATA_REQUEST" });
export const fetchUserDataSuccess = (userData) => ({ type: "FETCH_USER_DATA_SUCCESS", payload: userData });
export const fetchUserDataFailure = (error) => ({ type: "FETCH_USER_DATA_FAILURE", payload: error });

export const resetUserData = () => async (dispatch) => {
  dispatch({type: 'RESET_USER_DATA'});
}

export const sendFetchAccountData = (data) => async (dispatch) => {
    dispatch(fetchUserDataRequest());
    axios.post('https://mobile.authenticpass.com/api/account', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }).then(response => {
        const userData = response.data;
        dispatch(fetchUserDataSuccess(userData));
      })
      .catch(error => {
        const errorMessage = error.message;
        dispatch(fetchUserDataFailure(errorMessage));
      });
};