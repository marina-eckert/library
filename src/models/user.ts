import mongoose, { HydratedDocument, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

interface UserData {
  mail: string;
  passwordHash: string;
}

interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
}

type UserDocument = HydratedDocument<UserData, UserMethods>;

interface UserModel extends Model<UserData, object, UserMethods> {
  createWithPassword(mail: string, password: string): Promise<UserDocument>;
}

declare global {
  // Passport extends this global interface for authenticated requests.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      _id: mongoose.Types.ObjectId;
      mail: string;
    }
  }
}

const userSchema = new Schema<UserData, UserModel, UserMethods>(
  {
    mail: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

userSchema.methods.checkPassword = function (password: string) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.createWithPassword = async function (mail: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  return this.create({ mail: mail.toLowerCase().trim(), passwordHash });
};

export default mongoose.model<UserData, UserModel>("User", userSchema);
