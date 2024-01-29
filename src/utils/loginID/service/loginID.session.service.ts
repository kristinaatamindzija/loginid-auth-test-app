import axios from "axios";
import { urls } from "../loginID.api";
import * as dotenv from "dotenv";
dotenv.config();

const sessionUrl = urls.sessionUrl;

export interface LoginIDSessionService {
  beginSession(): Promise<any>;
  completeSession(session_id: string): Promise<string>;
}

const APP_ID = process.env.APP_ID;
const MFA_ID = process.env.MFA_ID;

export const loginIDApi = axios.create({
  baseURL: process.env.BASE_URL,
});

async function beginSession(): Promise<any> {
  const session = await loginIDApi.post(`${sessionUrl}/begin`, {
    app_id: APP_ID,
    mfa_id: MFA_ID,
  });

  return session.data;
}

async function completeSession(session_id: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    loginIDApi
      .post(`${sessionUrl}/complete`, {
        session_id,
      })
      .then((response) => {
        const { access_token } = response.data;
        console.log(access_token);
        resolve(access_token);
      })
      .catch((error) => {
        console.log("Error calling complete API:", error.message);

        reject(error);
      });
  });
}

export const loginIDSessionService: LoginIDSessionService = {
  beginSession,
  completeSession,
};
