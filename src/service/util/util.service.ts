import { loginIDSessionService } from "../../utils/loginID/service/loginID.session.service";
import { urls } from "../../utils/loginID/loginID.api";
import WebSocket from "ws";

const socketUrl = `${process.env.BASE_SOCKET_URL}${urls.sessionUrl}`;

export interface LoginIDUtilService {
  verifyUserByEmail(
    session_id: string,
    siginExpiredTime: number
  ): Promise<string>;
}

async function verifyUserByEmail(
  session_id: string,
  siginExpiredTime: number
): Promise<string> {
  const startTime = Date.now();
  const webSocketUrl = `${socketUrl}/${session_id}/credentials/email/wait`;

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
        const access_token = await loginIDSessionService.completeSession(
          session_id
        );
        resolve(access_token);
      }
    });

    const checkTimeout = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;

      if (elapsedTime >= Number(siginExpiredTime)) {
        ws.close();

        clearInterval(checkTimeout);
        reject(new Error("Email verification timeout"));
      }
    }, 1000);
  });
}

export const loginIDUtilService: LoginIDUtilService = {
  verifyUserByEmail,
};
