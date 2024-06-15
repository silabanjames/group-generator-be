import express from "express";
import { MentorController } from "../controllers/admin/Mentor.controller";
import { authentification } from "../middlewares/authentication.middleware";
import { authorization } from "../middlewares/authorization.middleware";

const Router = express.Router()

Router.get(
  "/", 
  MentorController.get
);

Router.get(
  "/:id", 
  authentification,
  authorization(["admin"]),
  MentorController.getDetails
);

Router.post(
  "/",
  authentification,
  authorization(["admin"]), 
  MentorController.post
);

Router.put(
  "/:id", 
  authentification,
  authorization(["admin"]),
  MentorController.edit
);

Router.delete(
  "/:id", 
  authentification,
  authorization(["admin"]),
  MentorController.delete
);

export { Router as mentorRouter }