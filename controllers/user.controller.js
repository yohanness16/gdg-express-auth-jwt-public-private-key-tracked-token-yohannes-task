import User from "../models/user.model.js";

export const getUser = async (req, res, next) => {
  try {
    console.log(req.user)
    const id = req.user?._id;
    if (!id) {
      const error = new Error("UnAuthorized");
      error.statusCode = 401;
      throw error;
    }
    console.log(id)
    const user = await User.findById(id).select("-password");
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
