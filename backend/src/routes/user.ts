import express from "express";
import AuthController from "../controllers/user.controller";
import { Protect } from "../middlewares/authenticate.middleware";
import { validateRegisterBody } from "../utils/bodyValidators/user";
import { IsAuthorize } from "../middlewares/authorize.middleware";

let user = express();

user.post("/signup", validateRegisterBody, AuthController.create);

user.post("/signin", AuthController.signIn);

user.post("/signout", AuthController.signOut);

// user.post("/refresh", AuthController.refreshToken);

user.use(Protect);

user.get("/my-profile", AuthController.get);

user.use(IsAuthorize("admin", "Manager"));

user.get("/users", AuthController.getAll);
user.put("/:id", AuthController.updateOne);
user.delete("/:id", AuthController.remove);

export default user;
