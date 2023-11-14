import mongoose, { Document, Types, mongo } from 'mongoose'
import { ICategory } from './category.model';

export interface IRestaurant {
  name: string;
  address: string;
  phone?: string;
  owners: Types.ObjectId[];
  staffs: Types.ObjectId[];
  restaurantPhotos?: string[];
  menuItems: Types.ObjectId[];
  categories: ICategory['_id'][];
}

const restaurantSchema = new mongoose.Schema<IRestaurant>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    owners: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner'
    }],
    staffs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff'
    }],
    restaurantPhotos: [{
      type: String,
      trim: true,
    }],
    menuItems: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem'
    }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', }]
  },
  {
    timestamps: true,
  },
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
