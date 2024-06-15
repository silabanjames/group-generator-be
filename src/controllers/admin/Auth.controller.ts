import { Request, Response } from "express"
import { User } from "../../entity/User.entity";
import { AppDataSource } from "../../data-source";
import { encrypt } from "../../helpers/helpers";

export class AuthController {
  static async loginAdmin(req: Request, res: Response) {
    try {
      const {email, password} = req.body
      if(!email || !password) {
        return res.status(400).json({ message: "Bad Request" });
      }

      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOneBy({
        email
      })

      const isPasswordValid = encrypt.comparepassword(user?.password || "", password)

      if(!user || !isPasswordValid) {
        return res.status(404).json({ message: "User not found" });
      }

      // const token = encrypt.generateToken({id: user.id})
      const token = encrypt.generateToken({id: user.id, email: user.email, role: user.role})


      return res.status(200).json({ message: "Login Success", user, token })

    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      if(!req["currentUser"]) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const id = req["currentUser"].id

      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOneBy({
        id
      })

      return res.status(200).json({ ...user, password: undefined })
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }

  static async registerAdmin(req: Request, res: Response) {
    try {
      const {email, password} = req.body
      if(!email || !password) {
        return res.status(400).json({ message: "Bad Request" });
      }

      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOneBy({
        email
      })

      if(user) {
        return res.status(404).json({ message: "User already exists" });
      }

      const hashedPassword = await encrypt.encryptpass(password)

      const newAdmin = new User()
      newAdmin.email = email
      newAdmin.password = hashedPassword
      newAdmin.role = "admin"

      await userRepository.save(newAdmin)
      return res.status(200).json({ message: "Login Success", user: newAdmin })

    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }
}