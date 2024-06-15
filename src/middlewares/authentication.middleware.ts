import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PayloadDto } from "../dto/payload.dto";

dotenv.config();

export const authentification = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const header = req.headers.authorization
  if(!header) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = header.split(" ")[1]

  if(!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET || "") as PayloadDto & jwt.JwtPayload
    if(!decode) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req["currentUser"] = decode
    return next()
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
