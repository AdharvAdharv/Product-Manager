import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, 
  products: {
    type: [String], 
    validate: [arrayLimit, "{PATH} exceeds the limit of 15"]
  }
}, { timestamps: true });


function arrayLimit(val) {
  return val.length <= 15;
}

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
