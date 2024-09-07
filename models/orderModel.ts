import mongoose, { Model, mongo, Schema } from "mongoose";
import { IProduct } from "./productModel";
import { IUser } from "./userModel";

export interface IOrder extends Document {
  shippingInfo: {
    firstName: string;
    lastName: string;
    phone: number;
    campus: string;
    hostel: string;
    block: string;
    wing: string;
    room: string;
  };
  orderItems: (Schema.Types.ObjectId | IProduct)[];
  payMethod: string;
  user: Schema.Types.ObjectId | IUser;
  payInfo: {
    id: string;
    status: string;
  };
  paidAt: Date;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  orderStatus: string;
  deliveredAt: Date;
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>({
  shippingInfo: {
    firstName: {
      type: String,
      required: [true, "Please Enter your first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please Enter your last name"],
    },
    phone: {
      type: Number,
      required: [true, "Please Enter your phone number"],
    },
    campus: {
      type: String,
      required: [true, "Please Enter your campus"],
    },
    hostel: {
      type: String,
      required: [true, "Please Enter your hostel"],
    },
    block: {
      type: String,
      required: [true, "Please Enter your block"],
    },
    wing: {
      type: String,
      required: [true, "Please Enter your wing"],
    },
    room: {
      type: String,
      required: [true, "Please Enter your room"],
    },
  },
  payMethod: {
    type: String,
    required: [true, "Please Enter your payment method"],
  },
  orderItems: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  payInfo: {
    id: {
      type: String,
      // required: true,
    },
    status: {
      type: String,
      // required: true,
    },
  },
  paidAt: {
    type: Date,
  },
  itemsPrice: {
    type: Number,
    required: true,
  },
  shippingPrice: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  deliveredAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
