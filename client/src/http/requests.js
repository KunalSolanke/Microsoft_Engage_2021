import axios from "axios";
import apiInstance from "./api";
import store from "../store";

export const setAuthToken = (token = null) => {
  if (!token) token = store.getState().auth.token;
  apiInstance.defaults.headers["Authorization"] = `Token ${token}`;
  return token;
};

const getRequest = async (url, token = null, secure = true) => {
  if (secure) token = setAuthToken(token);
  if (secure && token == null) {
    throw new Error("No auth token found");
  }
  try {
    let response = await apiInstance.get(url);
    let data = response.data;
    return data;
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong");
  }
};
const postRequest = async (url, data, token = null, secure = true) => {
  if (secure) token = setAuthToken((token = token));
  if (secure && !token) {
    throw new Error("No auth token found");
    return;
  }
  try {
    let response = await apiInstance.post(url, data);
    response = response.data;
    return response;
  } catch (err) {
    throw new Error("Something went wrong");
  }
};

export const findUsers = async (search) => await getRequest("/users/find?search=" + search);
export const createMeet = async (is_group, data = {}) =>
  await postRequest("/meet/create", { is_group, ...data });
export const addContact = async (userID) => await postRequest("/meet/contacts_add", { userID });
export const getMyContacts = async (token = null) =>
  await getRequest("/accounts/contacts/me", token);
export const getMyTeams = async (token = null) => await getRequest("/accounts/teams/me", token);
export const getMyActivity = async (data = {}) => await postRequest("/activity/me", data);
export const getChat = async (chatID) => {
  return await getRequest(`/meet/chat/${chatID}`);
};
export const createTeam = async (data) => await postRequest("/meet/teams_add", data);
export const createChannel = async (data) => await postRequest("/meet/channels_add", data);
export const getTeam = async (teamID) => {
  return await getRequest(`/meet/team/${teamID}`);
};
export const getChannel = async (channelID) => {
  return await getRequest(`/meet/channel/${channelID}`);
};
export const joinTeam = async (teamID) => {
  return await getRequest(`/meet/team/${teamID}/join`);
};
export const updateProfile = async (data) => await postRequest("/accounts/profile", data);
export const getActivity = async (data = {}) => {
  return await postRequest(`/accounts/activity`, data);
};
