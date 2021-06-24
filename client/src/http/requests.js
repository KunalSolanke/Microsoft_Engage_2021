import axios from "axios";
import apiInstance from "./api";
import store from "../store";

export const setAuthToken = () => {
  const token = store.getState().auth.token;
  apiInstance.defaults.headers["Authorization"] = `Token ${token}`;
};

const getRequest = async (url, secure = true) => {
  if (secure) setAuthToken();
  try {
    let response = await apiInstance.get(url);
    let data = response.data;
    return data;
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong");
  }
};
const postRequest = async (url, data, secure = true) => {
  if (secure) setAuthToken();
  try {
    let response = await apiInstance.post(url, data);
    response = response.data;
    return response;
  } catch (err) {
    throw new Error("Something went wrong");
  }
};

export const findUsers = async (search) => await getRequest("/users/find?search=" + search);
export const createMeet = async ({ user }) => await postRequest("/meet/create", { user });
export const addContact = async (userID) => await postRequest("/contacts_add", { userID });
export const getMyContacts = async () => await getRequest("/contacts/me");
export const getMyActivity = async () => await getRequest("/activity/me");
