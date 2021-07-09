import * as actionTypes from "../constants/auth";
import { UpdatedObj } from "../UpdateObj";

const initialState = {
  error: null,
  loading: false,
  token: null,
  profile: null,
  username: null,
  email: null,
  userID: null,
  notification: {
    open: false,
    title: "",
    message: "",
    kind: "",
  },
};

const authStart = (state, action) => {
  return UpdatedObj(state, {
    error: null,
    loading: true,
  });
};

const authSucces = (state, action) => {
  console.log("in authsuccess action", action.payload);
  return UpdatedObj(state, {
    token: action.payload.token,
    loading: false,
    username: action.payload.username || null,
    email: action.payload.email || null,
    userID: action.payload.userID || null,
    error: null,
    //username : action.payload.username
  });
};

const getProfileRequest = (state, action) => {
  return UpdatedObj(state, {
    loading: true,
    error: null,
  });
};

const updateProfileRequest = (state, action) => {
  return UpdatedObj(state, {
    loading: true,
    error: null,
  });
};

const updateProfileSuccess = (state, action) => {
  return UpdatedObj(state, {
    profile: action.payload,
  });
};

const getProfileSuccess = (state, action) => {
  console.log(action.payload);
  return UpdatedObj(state, {
    loading: false,
    error: null,
    profile: action.payload,
  });
};

const authFail = (state, action) => {
  return UpdatedObj(state, {
    error: action.error,
    loading: false,
  });
};

const authLogout = (state, action) => {
  return UpdatedObj(state, {
    token: null,
    username: null,
    email: null,
    profile: null,
    token: null,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSucces(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    case actionTypes.GET_PROFILE_REQUEST:
      return getProfileRequest(state, action);
    case actionTypes.GET_PROFILE_SUCCESS:
      return getProfileSuccess(state, action);
    case actionTypes.PROFILE_UPDATE_REQUEST:
      return updateProfileRequest(state, action);
    case actionTypes.PROFILE_UPDATE_SUCCESS:
      return updateProfileSuccess(state, action);
    case actionTypes.SET_NOTIFICATION:
      return UpdatedObj(state, {
        notification: action.payload,
      });
    default:
      return state;
  }
};

export default reducer;
