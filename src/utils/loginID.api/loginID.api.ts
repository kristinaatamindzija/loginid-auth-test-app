import axios from "axios";
import * as dotenv from "dotenv";

import { urls } from "./loginID.urls";
import { url } from "inspector";
const jwksClient = require("jwks-rsa");

dotenv.config();

const kid = process.env.KEY_ID;
const baseURL = process.env.BASE_URL;

const signinUrl = urls.signin;
const getPublicKeyUrl = urls.getPublicKey;
const APP_ID = process.env.APP_ID;
const MFA_ID = process.env.MFA_ID;

const loginIDApi = axios.create({
  baseURL: process.env.BASE_URL,
});

async function beginSiginProcess(): Promise<any> {
  const session = await loginIDApi.post(`${signinUrl}/begin`, {
    app_id: APP_ID,
    mfa_id: MFA_ID,
  });

  return session.data;
}

async function sendVerificationEmail(
  session_id: string,
  email: string
): Promise<any> {
  await loginIDApi.post(`${signinUrl}/authenticate/email/init`, {
    session_id,
    username: email,
  });
}

async function completeSigninProcess(session_id: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    loginIDApi
      .post(`${signinUrl}/complete`, {
        session_id,
      })
      .then((response) => {
        const { access_token } = response.data;

        resolve(access_token);
      })
      .catch((error) => {
        console.log("Error calling complete API:", error.message);

        reject(error);
      });
  });
}

async function getPublicKey(): Promise<string> {
  const client = jwksClient({
    strictSsl: true,
    jwksUri: `${baseURL}${getPublicKeyUrl}`,
  });

  console.log(`${baseURL}${getPublicKeyUrl}`);

  return new Promise<string>((resolve, reject) => {
    client.getSigningKey(kid, (e: any, key: any) => {
      if (e) {
        reject(e);
      } else {
        console.log("KEY " + key.publicKey);
        resolve(key.publicKey);
      }
    });
  });
}

export {
  loginIDApi,
  beginSiginProcess,
  sendVerificationEmail,
  completeSigninProcess,
  getPublicKey,
};
