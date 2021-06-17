import axios from "axios";
import apiInstance from "./api";
import store from "../store";

export const setAuthToken = () => {
  const token = store.getState().auth.token;
  apiInstance.defaults.headers["Authorization"] = `Token ${token}`;
};

export const findUsers = async (search, token, setusers) => {
  let users = [];
  setAuthToken();
  try {
    let response = await apiInstance.get("/users/find?search=" + search);
    let data = response.data;
    users = data;
    setusers(users);
  } catch (err) {
    console.log(err);
  }
};

export const createMeet = async (user) => {
  setAuthToken();
  try {
    let response = await apiInstance.post(`/meet/create`, { user });
    let data = response.data;
    return data;
  } catch (err) {
    console.log(err);
  }
  return null;
};
