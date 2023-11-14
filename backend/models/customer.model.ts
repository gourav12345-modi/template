import mongoose, { Schema, Document } from 'mongoose';

interface ICustomer {
    name: string;
    address?: string;
    email?: string;
    phone: string;
}

const customerSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

const Customer = mongoose.model<ICustomer>('Customer', customerSchema);

export default Customer;
