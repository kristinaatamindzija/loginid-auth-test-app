import { NextFunction, Request, Response } from "express";
import { authService } from "../service/auth.service";

export async function requireAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new Error("Unauthorized access");
  }

  try {
    const user = authService.validateAccessToken(token);
    res.locals = { user };
    next();
  } catch (err) {
    next(err);
  }
}
