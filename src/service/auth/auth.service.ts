import { promisify } from "util";
import { getPublicKeyFromStorage, storePublicKey } from "../../storage/storage";
import { loginIDAuthService } from "../../utils/loginID/service/loginID.auth.service";
const jwt = require("jsonwebtoken");

interface AuthService {
  validateAccessToken(token: string): Promise<any>;
}

async function validateAccessToken(token: string): Promise<any> {
  let publicKey = getPublicKeyFromStorage();

  if (!publicKey) {
    try {
      publicKey = await loginIDAuthService.getPublicKey();
      storePublicKey(publicKey);
    } catch (error) {
      throw new Error("Unauthorized access");
    }
  }

  return promisify(jwt.verify)(token, publicKey);
}

export const authService: AuthService = {
  validateAccessToken,
};
