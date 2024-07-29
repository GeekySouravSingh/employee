import express from "express";
import user from "./user";
import department from "./department";

const routes = express();

routes.use("/user", user);
routes.use("/department", department);

export default routes;
