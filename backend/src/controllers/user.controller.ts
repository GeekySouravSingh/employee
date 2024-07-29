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
    role: user.role.name ?? "none",
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

  // /v1/auth/signIn
  signIn: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("role");

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

  // /v1/auth/signOut
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

  update: async (req: Request, res: Response) => {},

  remove: async (req: Request, res: Response) => {
    // await User.deleteOne("");
  },
};

export default UserController;
