import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { PayloadDto } from "../dto/payload.dto"

dotenv.config()

const { JWT_SECRET = "" } = process.env

export class encrypt {
  static async encryptpass(password: string) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  }
  static async comparepassword(hashPassword: string, password: string) {
    return bcrypt.compareSync(password, hashPassword)
  }
  static generateToken(payload: PayloadDto) {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: "2d"
    })
  }
}