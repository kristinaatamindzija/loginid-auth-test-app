import { Router, Request, Response } from "express";
import { asyncErrorHandler } from "../utils/util";
import { emailAuthService } from "../service/auth/email.auth.service";
import { passkeyAuthService } from "../service/auth/passkey.auth.service";

const authRouter: Router = Router();

authRouter.post(
  "/signinWithEmail",
  asyncErrorHandler(async (request: Request, response: Response) => {
    const { username } = request.body;
    const user = await emailAuthService.signInWithEmail(username);

    return response.status(200).json(user);
  })
);

authRouter.post(
  "/signinWithPasskey",
  asyncErrorHandler(async (request: Request, response: Response) => {
    const { username } = request.body;
    const auth_token = await passkeyAuthService.signInWithPasskey(username);

    return response.status(200).json(auth_token);
  })
);

export { authRouter };
