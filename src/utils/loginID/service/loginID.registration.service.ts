import { loginIDApi, urls } from "../loginID.api";

interface LoginIDRegistrationService {
  initRegistrationByEmailProcess(
    session_id: string,
    email: string
  ): Promise<any>;
}

const sessionUrl = urls.sessionUrl;

async function initRegistrationByEmailProcess(
  session_id: string,
  email: string
): Promise<any> {
  await loginIDApi.post(`${sessionUrl}/register/email/init`, {
    session_id,
    username: email,
  });
}

export const loginIDRegistrationService: LoginIDRegistrationService = {
  initRegistrationByEmailProcess,
};
