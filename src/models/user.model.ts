import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { USER_MODEL } from "../libs/constants/user.const";

interface IUser extends mongoose.Document {
  username: string;
  password: string;
  name: string;
  age: number;
  salary: number;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  salary: { type: Number, required: true },
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const UserModel = mongoose.model<IUser>(USER_MODEL, UserSchema);

export default UserModel;

export { IUser };
