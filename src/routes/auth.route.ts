import { Router, Request, Response } from "express";
import { authService } from "../service/auth.service";
import { asyncErrorHandler } from "../utils/util";

const authRouter: Router = Router();

authRouter.post(
  "/signiWithEmail",
  asyncErrorHandler(async (request: Request, response: Response) => {
    const { username } = request.body;
    const user = await authService.login(username);

    return response.status(200).json(user);
  })
);

authRouter.post(
  "/signinWithPasskey",
  asyncErrorHandler(async (request: Request, response: Response) => {
    const { username } = request.body;
    const auth_token = await authService.signInWithPasskey(username);

    return response.status(200).json(auth_token);
  })
);

export { authRouter };
