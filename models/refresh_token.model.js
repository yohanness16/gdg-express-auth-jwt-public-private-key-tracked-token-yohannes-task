import mongoose, { mongo } from "mongoose";

const RefreshTokenSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  refresh_token: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  expires_at: {
    type: Date,
    required: true,
  },
});

RefreshTokenSchema.index({ expires_at: 1 }, {expireAfterSeconds:0});
RefreshTokenSchema.index({user_id:1});
const RefreshToken = mongoose.model("RefreshToken",RefreshTokenSchema);
export default RefreshToken
