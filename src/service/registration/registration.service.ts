import { loginIDRegistrationService } from "../../utils/loginID/service/loginID.registration.service";
import { loginIDSessionService } from "../../utils/loginID/service/loginID.session.service";
import { loginIDUtilService } from "../util/util.service";

const registrationExpiredTime = process.env.SINGIN_EXPIRED_TIME || "50000";

interface RegistrationService {
  registerByEmail(email: string): Promise<string>;
}

async function registerByEmail(email: string): Promise<string> {
  try {
    // Step 1: Begin registation processs
    const { session_id } = await loginIDSessionService.beginSession();

    // Step 2: Initiate email registaration verification
    await loginIDRegistrationService.initRegistrationByEmailProcess(
      session_id,
      email
    );

    // Step 3: Connect to WebSocket for real-time updates
    const access_token = loginIDUtilService.verifyUserByEmail(
      session_id,
      Number(registrationExpiredTime)
    );

    return access_token;
  } catch (error: any) {
    console.log("Signin faild with error :", error);
    throw new Error(error);
  }
}

export const registrationService: RegistrationService = {
  registerByEmail,
};
