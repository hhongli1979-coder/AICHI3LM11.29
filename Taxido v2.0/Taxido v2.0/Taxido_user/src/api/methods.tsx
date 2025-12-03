import { getValue } from "../utils/localstorage/index";
import { URL } from "./config";
import axios from "axios";

export const POST_API = async (body?: any, api?: string) => {
  const token = await getValue("token");
  const language = await getValue("selectedLanguage");
  const defultLng = await getValue("defaultLanguage");
  const defultLngValue = language || defultLng

  const res = await axios.post(URL + "/api/" + api, body, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
      "Accept-Lang": defultLngValue,
    },
  });
  return res;
};

export const GET_API = async (api?: string) => {


  const token = await getValue("token");
  const language = await getValue("selectedLanguage");
  const defultLng = await getValue("defaultLanguage");
  const defultLngValue = language || defultLng

  const res = await axios.get(URL + "/api/" + api, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
      "Accept-Lang": defultLngValue,
    },
  });
  return res;
};

export const DELETE_API = async (api?: string) => {
  const token = await getValue("token");
  const language = await getValue("selectedLanguage");
  const defultLng = await getValue("defaultLanguage");
  const defultLngValue = language || defultLng

  const res = await axios.delete(URL + "/api/" + api, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
      "Accept-Lang": defultLngValue,
    },
  });
  return res;
};

export const PUT_API = async (api: string, body: any) => {
  const token = await getValue("token");
  const language = await getValue("selectedLanguage");
  const defultLng = await getValue("defaultLanguage");
  const defultLngValue = language || defultLng

  try {
    const res = await axios.put(`${URL}/api/${api}`, body, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
        "Accept-Lang": defultLngValue,
      },
    });
    return res;
  } catch (error: any) {
    return error?.response;
  }
};
