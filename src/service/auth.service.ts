import {
  LoginIdConfiguration,
  LoginIdEmail,
  LoginIdPasskey,
} from "@loginid/web-sdk";
import { promisify } from "util";
import { getPublicKeyFromStorage, storePublicKey } from "../storage/storage";
import { getPublicKey } from "../environment/auth";
const jwt = require("jsonwebtoken");
import * as dotenv from "dotenv";
dotenv.config();

const baseUrl = process.env.BASE_URL ?? "";
const appID = process.env.APP_ID ?? "";

const loginIdConfig = new LoginIdConfiguration(baseUrl, appID);

const lidEmail = new LoginIdEmail(loginIdConfig);

interface AuthService {
  login(username: string): Promise<any>;
  signinWithEmail(username: string): Promise<string>;
  validateAuthToken(token: string): Promise<any>;
  signInWithPasskey(username: string): Promise<any>;
}

async function login(username: string): Promise<any> {
  let token = await signinWithEmail(username);

  try {
    const user = validateAuthToken(token);
    console.log(user);

    return user;
  } catch (e: any) {
    console.log(e);
    throw new Error("Please authenticate.");
  }
}

async function signinWithEmail(username: string): Promise<string> {
  let token: string = "";

  try {
    const result = await lidEmail.signinWithEmail(username);

    const { auth_data } = result;

    token = auth_data.token;
    return token;
  } catch (error) {
    console.log(error);
  }
  return token;
}

async function signInWithPasskey(username: string) {
  const loginIdConfig = new LoginIdConfiguration(baseUrl, appID);
  let lid = new LoginIdPasskey(loginIdConfig);
  try {
    const result = await lid.signinWithPasskey(username);

    const { auth_data } = result;

    return auth_data.token;
  } catch (e) {
    console.log(e);
    throw new Error("Please authenticate.");
  }
}

async function validateAuthToken(token: string): Promise<any> {
  let publicKey = getPublicKeyFromStorage();

  if (!publicKey) {
    try {
      publicKey = await getPublicKey();
      storePublicKey(publicKey);
    } catch (error) {
      throw new Error("Unauthorized access");
    }
  }

  const user = promisify(jwt.verify)(token, publicKey);

  return user;
}

export const authService: AuthService = {
  login,
  signinWithEmail,
  validateAuthToken,
  signInWithPasskey,
};
