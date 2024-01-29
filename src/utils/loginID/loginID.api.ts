import axios from "axios";

export const loginIDApi = axios.create({
  baseURL: process.env.BASE_URL,
});

export const urls = {
  sessionUrl: `/frontend-api/sessions/mfa`,
  publicKeyUrl: `/frontend-api/sessions/key`,
};
