import { loginIDAuthService } from "../../utils/loginID/service/loginID.auth.service";
import { loginIDSessionService } from "../../utils/loginID/service/loginID.session.service";
import { authService } from "./auth.service";

interface PasskeyAuthService {
  signInWithPasskey(email: string): Promise<any>;
}

async function signInWithPasskey(email: string): Promise<any> {
  let accessToken = await getAccessToken(email);

  try {
    const user = authService.validateAccessToken(accessToken);
    console.log(user);
  } catch (error) {
    console.log(error);
    throw new Error("Please authenticate.");
  }
}

async function getAccessToken(email: string): Promise<string> {
  try {
    // Step 1: Begin email verification
    const { session_id } = await loginIDSessionService.beginSession();

    // Step 2: Initiate email verification
    const { allowCredentials, challenge } =
      await loginIDAuthService.initSiginByPasskeyProcess(session_id, email);

    await loginIDAuthService.authenticateByPasskey(
      allowCredentials[0].id,
      challenge,
      session_id,
      email
    );

    // Step 3: Connect to WebSocket for real-time updates
    const access_token = loginIDSessionService.completeSession(session_id);

    console.log(access_token);
    return access_token;
  } catch (error: any) {
    console.log("Signin faild with error :", error);
    throw new Error(error);
  }
}

export const passkeyAuthService: PasskeyAuthService = {
  signInWithPasskey,
};
