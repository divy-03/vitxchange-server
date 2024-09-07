import mongoose, { Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number; // changed from string to number
  rating: number;
  category: string;
  stock: number;
  numOfReviews: number;
  user: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  images: { public_id: string; url: string }[];
  reviews: {
    user: mongoose.Schema.Types.ObjectId;
    name: string;
    rating: number;
    comment: string;
  }[];
}

const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: [true, "Please enter product name"],
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter product category"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter no of stocks"],
    maxlength: [6, "Stock cannot exceed 6 figure"],
    default: 1,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        max: [5, "rating cannot exceed 5"],
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  price: {
    type: Number,
    required: [true, "Please enter product price"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "User not logged in"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema
);
export default Product;
