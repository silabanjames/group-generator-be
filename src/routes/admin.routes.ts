import express from "express";
import { AdminController } from "../controllers/admin/Admin.controller";
import { authentification } from "../middlewares/authentication.middleware";
import { authorization } from "../middlewares/authorization.middleware";

const Router = express.Router()

Router.get(
  "/",
  authentification,
  authorization(["admin"]),
  AdminController.get
);

Router.get(
  "/:id", 
  authentification,
  authorization(["admin"]),
  AdminController.getDetails
);

Router.put(
  "/:id",
  authentification,
  authorization(["admin"]), 
  AdminController.update
)
Router.delete(
  "/:id", 
  authentification,
  authorization(["admin"]),
  AdminController.delete
)

export { Router as adminRouter }