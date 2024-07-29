import express from "express";
import { Protect } from "../middlewares/authenticate.middleware";
import { IsAuthorize } from "../middlewares/authorize.middleware";
import DepartmentController from "../controllers/department.controller";

let department = express();

// department.use(Protect);
// department.use(IsAuthorize("admin", "manager"));

department.post("/create", DepartmentController.create);

department.post("/update/:id", DepartmentController.update);
department.get("/getAll", DepartmentController.getAll);
department.get("/:id", DepartmentController.update);

export default department;
