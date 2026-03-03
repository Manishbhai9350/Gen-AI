import { model, Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-z0-9_.+-]+@[a-z0-9_.+-]+\.[a-z0-9_.+-]+$/i,
  },
  password: {
    type: String,
    required: true,
  },
});

export const UserModel = model("user", userSchema);
