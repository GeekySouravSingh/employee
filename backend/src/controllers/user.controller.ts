import { MESSAGES, STATUS_CODE } from "../constant/status";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { BadRequest } from "../errors/bad-request";
import { Password } from "../services/password.service";
import User from "../models/user";

export const createAndSendToken = async (
  user: any,
  res: Response,
  req: Request
) => {
  const userInfo = {
    id: user.id,
    email: user.email,
    role: user.role ?? "none",
    createdAt: user.createdAt,
  };

  const userJwt = jwt.sign(userInfo, process.env.JWT_KEY!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const refreshJwt = jwt.sign(userInfo, process.env.JWT_REFRESH_KEY!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });

  req.session = {
    jwt: userJwt,
    refreshJwt,
  };

  res.status(STATUS_CODE.SUCCESS).send({ user });
};

const UserController = {
  create: async (req: Request, res: Response) => {
    const { email } = req.body;

    if (req.body.role === "admin") {
      throw new BadRequest(MESSAGES.PERMISSION_DENIED, STATUS_CODE.NO_ACCESS);
    }

    const isExist = await User.findOne({ email });

    if (isExist) {
      throw new BadRequest(MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    let user = await User.create(req.body);

    createAndSendToken(user, res, req);

    res.status(STATUS_CODE.SUCCESS).send({ message: "success" });
  },

  signIn: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("department");

    if (!user) {
      throw new BadRequest("Email or password is incorrect");
    }

    const passwordMatch = await Password.compare(user.password, password);

    if (!passwordMatch) {
      throw new BadRequest("Email or password is incorrect");
    }

    createAndSendToken(user, res, req);
  },

  refreshToken: (req: Request, res: Response) => {
    const refreshToken = req.session!.refreshJwt;
    if (!refreshToken) {
      throw new BadRequest("Access Denied. No refresh token provided.");
    }

    const { iat, exp, ...userInfo }: any = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_KEY!
    );

    const accessToken = jwt.sign(userInfo, process.env.JWT_KEY!, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const refreshJwt = jwt.sign(userInfo, process.env.JWT_REFRESH_KEY!, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });

    req.session = {
      jwt: accessToken,
      refreshJwt,
    };
    res.status(STATUS_CODE.NO_CONTENT).send({});
  },

  signOut: (req: Request, res: Response) => {
    req.session = null;

    res.status(200).send({});
  },

  get: async (req: Request, res: Response) => {
    const user = await User.findOne({
      email: req?.currentUser!.email,
    }).populate("department");

    res
      .status(STATUS_CODE.SUCCESS)
      .send({ user: user ?? req?.currentUser ?? null });
  },

  getAll: async (req: Request, res: Response) => {
    try {
      let { sortBy = "createdAt", sortType = "-1" } = req.query;

      // Convert sortType to a number
      const sortValue = sortType === "1" ? 1 : -1;

      let sortField: Record<string, 1 | -1> = {};
      if (sortBy === "name") {
        sortField = { name: sortValue };
      } else {
        sortField = { [sortBy as string]: sortValue };
      }

      const users = await User.aggregate([
        { $match: { active: true } },
        {
          $addFields: {
            name: { $concat: ["$firstName", " ", "$lastName"] },
          },
        },
        {
          $sort: sortField,
        },
        {
          $lookup: {
            from: "Department",
            localField: "department",
            foreignField: "_id",
            as: "department",
          },
        },
        {
          $unwind: "$department",
        },
        {
          $project: {
            _id: 0,
            id: "$_id",
            firstName: 1,
            lastName: 1,
            email: 1,
            role: 1,
            address: 1,
            department: {
              id: "$department._id",
              name: "$department.name",
            },
          },
        },
      ]);

      res.json({ users });
    } catch (error: any) {
      console.log(error.message);

      res.status(500).send({ message: "An error occurred", error });
    }
  },

  updateOne: async (req: Request, res: Response) => {
    //we can sanitize data
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("department");

    res.status(STATUS_CODE.SUCCESS).send({ user });
  },

  remove: async (req: Request, res: Response) => {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        active: false,
      },
      {
        new: true,
      }
    );

    res.status(STATUS_CODE.SUCCESS).send({ user });
  },
};

export default UserController;
