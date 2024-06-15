import express from "express";
import { AuthController } from "../controllers/admin/Auth.controller";
import { authentification } from "../middlewares/authentication.middleware";
import { authorization } from "../middlewares/authorization.middleware";

const Router = express.Router()

Router.post(
  "/login", 
  AuthController.loginAdmin
);

Router.get(
  "/profile",
  authentification,
  authorization(["admin"]),
  AuthController.getProfile
)

Router.post(
  "/register",
  AuthController.registerAdmin
)

export { Router as authRouter };