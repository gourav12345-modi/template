import mongoose, { Document } from 'mongoose';

export interface ICategory extends Document {
    name: string;
}

const categorySchema = new mongoose.Schema<ICategory>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;
