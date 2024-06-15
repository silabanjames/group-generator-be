import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { User } from "../../entity/User.entity";

export class AdminController {
  static async get(req: Request, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User);

      const users = await userRepository.find({
        // where: {
        //   role: "admin",
        // },
      });

      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getDetails(req: Request, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id: req.params.id });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Fungsionalitas Post telah berada di AUTH

  static async update(req: Request, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User);

      const users = await userRepository.update(
        { id: req.params.id },
        { ...req.body }
      );

      return res.status(200).json("User updated");
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.delete({ id: req.params.id });
      return res.status(200).json("User deleted");
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
