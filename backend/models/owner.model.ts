import mongoose, { Document, Types } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IOwner extends Document {
  name: string;
  phone: string;
  email: string;
  address?: string;
  password: string;
  profilePhoto?: string;
}

const ownerSchema = new mongoose.Schema<IOwner>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false
    },
    profilePhoto: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

ownerSchema.pre('save', async function (next) {
  const owner = this;
  if (owner.isModified('password')) {
    // Hash the password before saving it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(owner.password, saltRounds);
    owner.password = hashedPassword
  }
  next();
});

const Owner = mongoose.model('Owner', ownerSchema);

export default Owner;
