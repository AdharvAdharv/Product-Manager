import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productId: { type: String, unique: true },
  name: { type: String, required: true, minlength: 3 },
  description: { type: String, required: true, minlength: 10, maxlength: 50 },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true, lowercase: true },
  ownerId: { type: String, required: true }, 
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);
