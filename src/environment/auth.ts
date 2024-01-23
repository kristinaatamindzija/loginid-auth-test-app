const jwksClient = require("jwks-rsa");
import * as dotenv from "dotenv";
dotenv.config();

const apiUrl = process.env.GET_JWKS_PATH;
const kid = process.env.KEY_ID;

export async function getPublicKey(): Promise<string> {
  const client = jwksClient({
    strictSsl: true,
    jwksUri: `${apiUrl}`,
  });

  return new Promise<string>((resolve, reject) => {
    client.getSigningKey(kid, (e: any, key: any) => {
      if (e) {
        reject(e);
      } else {
        const signingKey = key.publicKey;
        console.log("KEY " + signingKey);
        resolve(signingKey);
      }
    });
  });
}
