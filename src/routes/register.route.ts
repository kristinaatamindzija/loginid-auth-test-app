import { Router, Response, Request } from "express";
import { asyncErrorHandler } from "../utils/util";
import { registrationService } from "../service/registration.service/registration.service";

const registerRouter: Router = Router();

registerRouter.post(
  "/register",
  asyncErrorHandler(async (request: Request, response: Response) => {
    const { username } = request.body;
    const user = await registrationService.registerByEmail(username);

    return response.status(200).json(user);
  })
);

export { registerRouter };
