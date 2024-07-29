import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const validateRegisterBody = [
  check("firstName")
    .trim()
    .notEmpty()
    .withMessage("First Name is required")
    .isLength({ min: 2 })
    .withMessage("First Name must be at least 2 characters long"),

  check("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last Name is required")
    .isLength({ min: 2 })
    .withMessage("Last Name must be at least 2 characters long"),

  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  check("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["Employee", "Manager"])
    .withMessage("Role must be either employee or manager"),

  check("department")
    .trim()
    .notEmpty()
    .withMessage("Department is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid department ID"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
