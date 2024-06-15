import express from "express";
import { MemberController } from "../controllers/admin/Member.controller";
import { authorization } from "../middlewares/authorization.middleware";
import { authentification } from "../middlewares/authentication.middleware";

const Router = express.Router()

Router.get("/", MemberController.get)

Router.get(
  "/:id", 
  authentification,
  authorization(["admin"]),
  MemberController.getDetails
)

Router.post("/", MemberController.post)

Router.put(
  "/:id",
  authentification,
  authorization(["admin"]), 
  MemberController.edit
)

Router.delete(
  "/:id", 
  authentification,
  authorization(["admin"]),
  MemberController.delete
)

export { Router as memberRouter }