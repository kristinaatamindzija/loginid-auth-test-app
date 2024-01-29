import { loginIDAuthService } from "../../utils/loginID/service/loginID.auth.service";
import { authService } from "./auth.service";
import { loginIDSessionService } from "../../utils/loginID/service/loginID.session.service";
import * as dotenv from "dotenv";
import { loginIDUtilService } from "../util/util.service";
dotenv.config();

const siginExpiredTime = process.env.SINGIN_EXPIRED_TIME;

interface EmailAuthService {
  signInWithEmail(email: string): Promise<any>;
  getAccessToken(username: string): Promise<string>;
}

async function signInWithEmail(email: string): Promise<any> {
  let accessToken = await getAccessToken(email);

  try {
    const user = authService.validateAccessToken(accessToken);
    console.log(user);

    return user;
  } catch (error) {
    console.log(error);
    throw new Error("Please authenticate.");
  }
}

async function getAccessToken(email: string): Promise<string> {
  try {
    // Step 1: Begin email verification
    const { session_id } = await loginIDSessionService.beginSession();

    // Step 2: Initiate email signin verification
    await loginIDAuthService.initSigninByEmailProcess(session_id, email);

    // Step 3: Connect to WebSocket for real-time updates
    const access_token = loginIDUtilService.verifyUserByEmail(
      session_id,
      Number(siginExpiredTime)
    );

    return access_token;
  } catch (error: any) {
    console.log("Signin faild with error :", error);
    throw new Error(error);
  }
}

export const emailAuthService: EmailAuthService = {
  signInWithEmail,
  getAccessToken,
};
