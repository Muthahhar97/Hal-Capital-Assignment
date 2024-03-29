import mongoose from "mongoose";

interface User extends mongoose.Document {
  name: string;
  age: number;
  salary: number;
}

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  salary: { type: Number, required: true },
});

const UserModel = mongoose.model<User>("User", UserSchema);

export default UserModel;
