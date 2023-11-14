import mongoose, { Document, Types } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IStaff {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  password: string;
  profilePhoto?: string;
  restaurant: Types.ObjectId;
}

const staffSchema = new mongoose.Schema<IStaff>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      require: true,
      trim: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant'
    },
    email: {
      type: String,
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

staffSchema.index({ restaurant: 1, phone: 1 }, { unique: true })
staffSchema.pre('save', async function (next) {
  const staff = this;
  if (staff.isModified('password')) {
    // Hash the password before saving it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(staff.password, saltRounds);
    staff.password = hashedPassword
  }
  next();
});

const Staff = mongoose.model('Staff', staffSchema);

export default Staff;
