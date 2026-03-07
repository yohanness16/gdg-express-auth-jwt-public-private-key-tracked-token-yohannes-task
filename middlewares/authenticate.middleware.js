import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_PUBLIC_KEY } from "../config/env.js";
import User from "../models/user.model.js";

export const authenticateAccessToken = async ( req, res, next) => {
  try {
    const access_token = req.cookies?.access_token;
    console.log(req.cookies)
    if (!access_token) {
      const error = new Error("Access token missing");
      error.statusCode = 401;
      throw error;
    }
    const decoded = jwt.verify(access_token, ACCESS_TOKEN_PUBLIC_KEY);
    console.log(decoded)
    const user = await User.findById(decoded.user_id);
    if (!user) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      throw error;
    }

    
    req.user = user;
    next()
  } catch (err) {
    next(err);
  }
};

