import { STATUS_CODE } from "../constant/status";
import { Request, Response } from "express";
import Department from "../models/department";

const DepartmentController = {
  create: async (req: Request, res: Response) => {
    console.log("req.body", req.body);

    const department = await Department.create(req.body);

    res.status(STATUS_CODE.CREATED).json({ department });
  },

  get: async (req: Request, res: Response) => {
    const department = await Department.findById(req.params.id);

    res.status(STATUS_CODE.SUCCESS).json({ department });
  },

  getAll: async (req: Request, res: Response) => {
    const departments = await Department.find({});
    console.log("departments", departments);

    res.status(STATUS_CODE.SUCCESS).json({ departments });
  },

  update: async (req: Request, res: Response) => {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(STATUS_CODE.SUCCESS).json({ department });
  },

  remove: async (req: Request, res: Response) => {},
};

export default DepartmentController;
