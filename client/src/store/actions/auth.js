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
    }
  };
};

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
    }
  };
};

export const logout = () => {
  return async (dispatch, getState) => {
    //console.log("hree");
    try {
      const token = await getState().auth.token;

      if (!token) {
        dispatch(authLogout());
        return;
      }
      axios.defaults.headers["Authorization"] = `Token ${token}`;
      axios.get(`/accounts/logout`);
      dispatch(authLogout());
    } catch (err) {
      //console.log(err);
      dispatch(authLogout());
      await dispatch(authFail(err));
    }
  };
};

let wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const checkauthtimeout = (expiry) => {
  return async (dispatch, getState) => {
    await wait(expiry);
    //console.log(expiry, "here");
    try {
      await dispatch(authUpdateState());
    } catch (err) {
      await dispatch(authLogout());
    }
  };
};

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
      //console.log(err);
      await dispatch(authFail(err));
    }
  };
};

export const updateProfile = (data) => {
  //console.log("entering here");
  return async (dispatch, getState) => {
    dispatch(updateProfileRequest());
    //console.log("entering here");
    const token = await getState().auth.token;
    if (!token) {
      return;
    }
    try {
      axios.defaults.headers["Authorization"] = `Token ${token}`;
      const response = await axios.post(`/accounts/profile`, data);
      //console.log(response);
      await dispatch(getProfileSuccess(response.data));
    } catch (err) {
      //console.log(err);
      await dispatch(authFail(err));
    }
  };
};

export const authLogin = ({ password, email }) => {
  return async (dispatch, getState) => {
    await dispatch(authStart());
    try {
      const response = await axios.post(`/accounts/login`, { email, password });
      await dispatch(authSuccess(response.data));
      await dispatch(getProfile());
      dispatch(checkauthtimeout((response.data.expiry - 60) * 1000));
    } catch (err) {
      //console.log(err);
      await dispatch(authFail(err));
    }
  };
};

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
      //console.log("sennding post req....", response.data);
      const data = {
        username,
        email,
        token,
      };
      await dispatch(authSuccess(data));
      await dispatch(getProfile());
      dispatch(checkauthtimeout((response.data.expiry - 60) * 1000));
    } catch (err) {
      //console.log(err);
      await dispatch(authFail(err));
    }
  };
};

export const socialAuth = (data, provider) => {
  return async (dispatch, getState) => {
    await dispatch(authStart());
    try {
      const response = await axios.post(`/auth/social/${provider}`, data);
      //console.log("sennding post req....", response.data);
      const expiry = new Date(new Date().getTime() + (response.data.expiry - 60) * 1000);
      await dispatch(authSuccess(response.data));
      await dispatch(getProfile());
      dispatch(checkauthtimeout((response.data.expiry - 60) * 1000));
    } catch (err) {
      //console.log(err);
      await dispatch(authFail(err));
    }
  };
};
