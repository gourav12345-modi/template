import mongoose from 'mongoose'
import { ICategory } from './category.model';

export interface IMenuItem {
    name: string;
    price: number;
    images?: [string];
    description: string;
    isVeg: boolean;
    categories: ICategory['_id'][];
    isServed: boolean;
}

const menuItemSchema = new mongoose.Schema<IMenuItem>(
    {
        name: String,
        images: [String],
        description: String,
        price: Number,
        isVeg: Boolean,
        categories: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category',
            },
        ],
        isServed: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;
