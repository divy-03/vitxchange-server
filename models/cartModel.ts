import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./userModel";
import { IProduct } from "./productModel";

// Interface for individual cart item
interface ICartItem {
  pid: Schema.Types.ObjectId | IProduct; // Product ID reference or full product object
  quantity: number; // Quantity of the product
}

// Updated interface for Cart document
export interface ICart extends Document {
  user: Schema.Types.ObjectId | IUser; // User ID reference or full user object
  cartItems: ICartItem[]; // Array of cart items
}

const cartSchema = new Schema<ICart>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  cartItems: [
    {
      pid: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
      },
    },
  ],
});

const Cart: Model<ICart> = mongoose.model<ICart>("Cart", cartSchema);
export default Cart;
