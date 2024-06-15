import { AppDataSource } from "./data-source";
import express from "express";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import cors from "cors";
import "reflect-metadata";
import { PayloadDto } from "./dto/payload.dto";
import { errorHandler } from "./middlewares/error.middleware";
import { authRouter } from "./routes/auth.routes";
import { mentorRouter } from "./routes/mentor.routes";
import { memberRouter } from "./routes/member.routes";
import { adminRouter } from "./routes/admin.routes";
dotenv.config();

declare global {
  namespace Express {
    export interface Request {
      currentUser?: PayloadDto;
    }
  }
}

const app = express();
app.use(express.json());
app.use(cors());

app.use(errorHandler);
const { PORT = 3000 } = process.env;
app.use("/auth", authRouter)
app.use("/mentor", mentorRouter);
app.use("/member", memberRouter);
app.use("/admin", adminRouter);

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));
