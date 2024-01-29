import axios from "axios";
import * as dotenv from "dotenv";
import { loginIDApi, urls } from "../loginID.api";
const jwksClient = require("jwks-rsa");

dotenv.config();

const kid = process.env.KEY_ID;
const baseURL = process.env.BASE_URL;

const sessionUrl = urls.sessionUrl;
const getPublicKeyUrl = urls.publicKeyUrl;

interface LoginIDAuthService {
  initSigninByEmailProcess(session_id: string, email: string): Promise<any>;
  initSiginByPasskeyProcess(session_id: string, email: string): Promise<any>;
  authenticateByPasskey(
    id: string,
    challenge: string,
    session_id: string,
    username: string
  ): Promise<any>;
  getPublicKey(): Promise<string>;
}

async function initSigninByEmailProcess(
  session_id: string,
  email: string
): Promise<any> {
  await loginIDApi.post(`${sessionUrl}/authenticate/email/init`, {
    session_id,
    username: email,
  });
}

async function initSiginByPasskeyProcess(
  session_id: string,
  email: string
): Promise<any> {
  const response = await loginIDApi.post(
    `${sessionUrl}/authenticate/fido2/init`,
    {
      session_id,
      username: email,
    }
  );
  return response.data;
}

async function authenticateByPasskey(
  id: string,
  challenge: string,
  session_id: string,
  username: string
): Promise<any> {
  const url = `${sessionUrl}/authenticate/fido2/complete`;
  try {
    const response = await axios.post(
      "https://zjnr4kzn-wuajypqvgelwg.gen2.qa.loginid.io/frontend-api/sessions/mfa/authenticate/fido2/complete",
      {
        session_id,
        username,
        assertation_response: {
          challenge,
          rpID: "localhost",
          type: "public-key",
          response: {
            authenticatorData:
              "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MFAAAADw",
            clientDataJSON:
              "eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiTVlycFplOHlZY3RoeXhlQ3Y0UlVYdV9qTTNsaGRzUUJoSlJwV09qS1lTMCIsIm9yaWdpbiI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsImNyb3NzT3JpZ2luIjpmYWxzZSwib3RoZXJfa2V5c19jYW5fYmVfYWRkZWRfaGVyZSI6ImRvIG5vdCBjb21wYXJlIGNsaWVudERhdGFKU09OIGFnYWluc3QgYSB0ZW1wbGF0ZS4gU2VlIGh0dHBzOi8vZ29vLmdsL3lhYlBleCJ9",
            signature:
              "P3_HKgQl8uEqliAsDlkkpFOY2I6Q1NjJcaXRnGeKezE0h85SiTSRAE7XtSpJYZFsVfZizhkhpjR6J8Fu4d-Po74aCy3Di3rnAGTXlOdbf5FxIW250dWB2-378HsqCVxUJSu9Gd41EkJgPPsWf5qG-y1CWMcm6TV0lpaXBpQm9NE6zmaWFwsQoyn6bvEDWqQ3cOBpBpiMzcj3oQTExYYYKFEOOK-Vp0KgoxULsn01m9DriOh9VqGOXRbBcKgtwsg_nonPXEIGylTCh3o1991E5F7teapJd4XQCYEzGu0EU9xF1ne5RoJhBBo0MLCxey7jAGHBVBOCAT8dSFMAzrFgRQ",
          },
        },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Error " + error);
  }
}

async function getPublicKey(): Promise<string> {
  const client = jwksClient({
    strictSsl: true,
    jwksUri: `${baseURL}${getPublicKeyUrl}`,
  });

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

export const loginIDAuthService: LoginIDAuthService = {
  initSigninByEmailProcess,
  initSiginByPasskeyProcess,
  getPublicKey,
  authenticateByPasskey,
};
