import mongoose, { Document, Types } from 'mongoose'

export interface IItemQuantity {
  Item: Types.ObjectId;
  quantity: Number;
}

export interface IOrder  {
  restaurant: Types.ObjectId;
  customer: Types.ObjectId;
  items?: IItemQuantity[];
  status: String;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant'
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer'
    },
    items: [{
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
      },
      quantity: Number,
    }],
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
