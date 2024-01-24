import { promisify } from "util";
import { getPublicKeyFromStorage, storePublicKey } from "../storage/storage";
import { urls } from "../utils/loginID.api/loginID.urls";
import {
  beginSiginProcess,
  completeSigninProcess,
  getPublicKey,
  sendVerificationEmail,
} from "../utils/loginID.api/loginID.api";
import WebSocket from "ws";

import * as dotenv from "dotenv";
dotenv.config();

const jwt = require("jsonwebtoken");

const SINGIN_EXPIRED_TIME = process.env.SINGIN_EXPIRED_TIME;

const signinSocketUrl = `${process.env.BASE_SOCKET_URL}${urls.signin}`;

interface AuthService {
  signInWithEmail(email: string): Promise<any>;
  getAccessToken(username: string): Promise<string>;
  validateAccessToken(accessToken: string): Promise<any>;
  //signInWithPasskey(username: string): Promise<any>;
}

async function signInWithEmail(email: string): Promise<any> {
  let accessToken = await getAccessToken(email);

  try {
    const user = validateAccessToken(accessToken);
    console.log(user);

    return user;
  } catch (e: any) {
    console.log(e);
    throw new Error("Please authenticate.");
  }
}

async function getAccessToken(email: string): Promise<string> {
  try {
    // Step 1: Begin email verification
    const { session_id } = await beginSiginProcess();

    // Step 2: Initiate email verification
    await sendVerificationEmail(session_id, email);

    // Step 3: Connect to WebSocket for real-time updates
    const access_token = verifyUserByEmail(session_id);

    return access_token;
  } catch (error: any) {
    console.log("Signin faild with error :", error);
    throw new Error(error);
  }
}

async function verifyUserByEmail(session_id: string) {
  const startTime = Date.now();
  const webSocketUrl = `${signinSocketUrl}/${session_id}/credentials/email/wait`;

  const ws = new WebSocket(webSocketUrl);
  return new Promise<string>((resolve, reject) => {
    ws.on("open", () => {
      console.log("WebSocket connection opened");
    });

    ws.on("message", async (message: any) => {
      console.log("WebSocket message received:", message);

      const parsedMessage = JSON.parse(message.toString());

      if (parsedMessage.is_authenticated === true) {
        console.log("Email verification is complete");

        ws.close();

        // Step 4: Call the "complete" endpoint
        const access_token = await completeSigninProcess(session_id);
        resolve(access_token);
      }
    });

    const checkTimeout = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;

      if (elapsedTime >= Number(SINGIN_EXPIRED_TIME)) {
        ws.close();

        clearInterval(checkTimeout);
        reject(new Error("Email verification timeout"));
      }
    }, 1000);
  });
}

async function validateAccessToken(token: string): Promise<any> {
  let publicKey = getPublicKeyFromStorage();

  if (!publicKey) {
    try {
      publicKey = await getPublicKey();
      storePublicKey(publicKey);
    } catch (error) {
      throw new Error("Unauthorized access");
    }
  }

  return promisify(jwt.verify)(token, publicKey);
}

export const authService: AuthService = {
  signInWithEmail,
  getAccessToken,
  validateAccessToken,
  //signInWithPasskey,
};
