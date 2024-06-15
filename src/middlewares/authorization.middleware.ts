import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User.entity";

export const authorization = (roles: string[]) => {
  return async (
    req: Request, 
    res: Response, 
    next: NextFunction
  ) => {
    try {
      if(!req["currentUser"]) {
        console.log("Gagal")
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req["currentUser"].id

      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOneBy({
        id: userId
      })

      if(!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if(!roles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      return next()

    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
}