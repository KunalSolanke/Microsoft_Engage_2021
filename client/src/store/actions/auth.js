import * as authActions from "../constants/auth.js";
import axios from "../../http/api";

export const authStart = () => {
  return {
    type: authActions.AUTH_START,
  };
};

export const authSuccess = (data) => {
  return {
    type: authActions.AUTH_SUCCESS,
    payload: data,
  };
};

export const authFail = (data) => {
  return {
    type: authActions.AUTH_FAIL,
    payload: data,
  };
};

export const authLogout = () => {
  return {
    type: authActions.AUTH_LOGOUT,
  };
};

export const getProfileRequest = () => {
  return {
    type: authActions.GET_PROFILE_REQUEST,
  };
};

export const getProfileSuccess = (data) => {
  return {
    type: authActions.GET_PROFILE_SUCCESS,
    payload: data,
  };
};

export const updateProfileRequest = () => {
  return {
    type: authActions.PROFILE_UPDATE_REQUEST,
  };
};

export const updateProfileSuccess = (data) => {
  return {
    type: authActions.PROFILE_UPDATE_SUCCESS,
    payload: data,
  };
};

/**
 * Update the authState,if current session
 *  expires,try tp get new token before logging out
 */
export const authUpdateState = () => {
  return async (dispatch, getState) => {
    try {
      axios.defaults.headers["Authorization"] = null;
      const res = await axios.get("/accounts/refresh");
      dispatch(checkauthtimeout((res.data.expiry - 60) * 1000));
      await dispatch(authSuccess(res.data));
      await dispatch(getProfile());
    } catch (err) {
      await dispatch(authFail(err));
      dispatch(setNotification("Login error", "Please login again"));
    }
  };
};

/**
 * check if auth is still valid,by trying to refresh
 * the token with resfresh token api
 * @param {*} history
 */
export const authCheckState = (history) => {
  return async (dispatch, getState) => {
    try {
      axios.defaults.headers["Authorization"] = null;
      const res = await axios.get("/accounts/refresh");
      dispatch(checkauthtimeout((res.data.expiry - 60) * 1000));
      await dispatch(authSuccess(res.data));
      await dispatch(getProfile());
    } catch (err) {
      await dispatch(authFail(err));
      history.push("/accounts/login");
      dispatch(setNotification("Login error", "Please login again"));
    }
  };
};

/**
 * Logout user and setcurrent refresh token null
 * logout api
 * and refirect user to landing page
 */
export const logout = () => {
  return async (dispatch, getState) => {
    console.log("Log user out");
    try {
      const token = await getState().auth.token;

      if (!token) {
        dispatch(authLogout());
        return;
      }
      axios.defaults.headers["Authorization"] = `Token ${token}`;
      axios.get(`/accounts/logout`);
      dispatch(authLogout());
      dispatch(setNotification("Success", "Logged out successfully", "success"));
    } catch (err) {
      console.log(err);
      dispatch(authLogout());
      await dispatch(authFail(err));
      dispatch(setNotification("Log error", "Please refresh browser", "warning"));
    }
  };
};

/**
 * Wait till auth token expiry and try to refesh to auth token
 * send notification to logged in
 * @param {string} ms
 */
let wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const checkauthtimeout = (expiry) => {
  return async (dispatch, getState) => {
    await wait(expiry);
    try {
      await dispatch(authUpdateState());
    } catch (err) {
      dispatch(
        setNotification(
          "Session ended",
          "Your session has ended please signin again/make sure\
      third party cookies are allowed",
          "warning"
        )
      );
      await dispatch(authLogout());
    }
  };
};
/**
 * Get current user profile with auth token from
 * profile endpoint
 */
export const getProfile = () => {
  return async (dispatch, getState) => {
    dispatch(getProfileRequest());
    const token = await getState().auth.token;
    if (!token) {
      return;
    }
    axios.defaults.headers["Authorization"] = `Token ${token}`;
    try {
      const response = await axios.get(`/accounts/profile`);
      dispatch(getProfileSuccess(response.data));
    } catch (err) {
      console.log(err);
      await dispatch(authFail(err));
      let errMessage = err.response?.data || err.message || err;
      dispatch(setNotification("Something went wrong", errMessage + "\nPlease try refreshing"));
    }
  };
};

/**
 * Update profile request with changed data
 * @param {*} data
 */

export const updateProfile = (data) => {
  return async (dispatch, getState) => {
    dispatch(updateProfileRequest());
    const token = await getState().auth.token;
    if (!token) {
      return;
    }
    try {
      axios.defaults.headers["Authorization"] = `Token ${token}`;
      const response = await axios.post(`/accounts/profile`, data);
      await dispatch(getProfileSuccess(response.data));
    } catch (err) {
      console.log(err);
      await dispatch(authFail(err));
      let errMessage = err.response?.data || err.message || err;
      dispatch(setNotification("Something went wrong", errMessage + "\nPlease try refreshing"));
    }
  };
};

/**
 * call login endpoint with user creds
 * @param {*} creds email and password
 */
export const authLogin = ({ password, email }) => {
  return async (dispatch, getState) => {
    await dispatch(authStart());
    try {
      const response = await axios.post(`/accounts/login`, { email, password });
      await dispatch(authSuccess(response.data));
      await dispatch(getProfile());
      dispatch(checkauthtimeout((response.data.expiry - 60) * 1000));
      dispatch(setNotification("Success", "Signed in successfully", "success"));
    } catch (err) {
      console.log(err);
      await dispatch(authFail(err));
      let errMessage = err.response?.data || err.message || err;
      dispatch(setNotification("Something went wrong", errMessage + "\nPlease try refreshing"));
    }
  };
};

/**
 * Post signup endpoint
 * @param {*} userdata signup user with user data
 */
export const authRegister = ({ username, email, password }) => {
  return async (dispatch, getState) => {
    await dispatch(authStart());
    try {
      const response = await axios.post(`/accounts/signup`, {
        username,
        email,
        password,
      });
      let token = response.data.token;
      await dispatch(authSuccess(response.data));
      await dispatch(getProfile());
      dispatch(setNotification("Success", "Registered successfully", "success"));
      dispatch(checkauthtimeout((response.data.expiry - 60) * 1000));
    } catch (err) {
      console.log(err);
      await dispatch(authFail(err));
      let errMessage = err.response?.data || err.message || err;
      dispatch(setNotification("Something went wrong", errMessage + "\nPlease try refreshing"));
    }
  };
};

/**
 * handle social auth endpoint ,login user using google,outlook,github
 * @param {*} data accestokens
 * @param {*} provider google | outlook | github
 */
export const socialAuth = (data, provider) => {
  return async (dispatch, getState) => {
    await dispatch(authStart());
    try {
      const response = await axios.post(`/auth/social/${provider}`, data);
      const expiry = new Date(new Date().getTime() + (response.data.expiry - 60) * 1000);
      await dispatch(authSuccess(response.data));
      await dispatch(getProfile());
      dispatch(checkauthtimeout((response.data.expiry - 60) * 1000));
      dispatch(setNotification("Success", "Signed in successfully", "success"));
    } catch (err) {
      console.log(err);
      await dispatch(authFail(err));
      let errMessage = err.response?.data || err.message || err;
      dispatch(setNotification("Something went wrong", errMessage + "\nPlease try refreshing"));
    }
  };
};

/**
 * Set new notification ,handles error ,waringin and info notificatios
 * @param {sting} title title of not tile
 * @param {string} message subtitle of not. tile
 * @param {string} kind info | info-square | error | success | warning
 */

export const setNotification = (title, message, kind = "error") => {
  return async (dispatch, getState) => {
    dispatch({
      type: authActions.SET_NOTIFICATION,
      payload: {
        open: true,
        title,
        kind,
        message,
      },
    });

    setTimeout(() => {
      dispatch({
        type: authActions.SET_NOTIFICATION,
        payload: {
          open: false,
          title: "",
          message: "",
          kind: "",
        },
      });
    }, 2000);
  };
};
