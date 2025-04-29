import express from "express";
import { Wishlist } from "../Models/Wishlist.js";
import { Product } from "../Models/Product.js";
import { jwtAuthMiddleware } from "../Middleware/AuthMiddleware.js";

const router = express.Router();


router.post("/add", jwtAuthMiddleware("any"), async (req, res) => {
  try {
    
    if (req.user.userRole !== "user") {
      return res.status(403).json({ message: "Only users can access wishlist" });
    }

    const { productId } = req.body;

   
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    
    let wishlist = await Wishlist.findOne({ userId: req.user.userId });

   
    if (!wishlist) {
      wishlist = new Wishlist({
        userId: req.user.userId,
        products: [productId]
      });
      await wishlist.save();
      return res.status(201).json({ message: "Product added to wishlist", wishlist });
    }

   
    if (wishlist.products.length >= 15) {
      return res.status(400).json({ message: "Wishlist can only have maximum 15 products" });
    }

   
    if (wishlist.products.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    
    wishlist.products.push(productId);
    await wishlist.save();

    res.status(200).json({ message: "Product added to wishlist", wishlist });

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


router.delete("/remove/:productId", jwtAuthMiddleware("any"), async (req, res) => {
    try {
      
      if (req.user.userRole !== "user") {
        return res.status(403).json({ message: "Only users can access wishlist" });
      }
  
      const { productId } = req.params;
  
     
      const wishlist = await Wishlist.findOne({ userId: req.user.userId });
      if (!wishlist) {
        return res.status(404).json({ message: "Wishlist not found" });
      }
  
     
      if (!wishlist.products.includes(productId)) {
        return res.status(404).json({ message: "Product not in wishlist" });
      }
  
     
      wishlist.products = wishlist.products.filter(id => id !== productId);
      await wishlist.save();
  
      res.status(200).json({ message: "Product removed from wishlist", wishlist });
  
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

 
router.get("/mywishlist", jwtAuthMiddleware("any"), async (req, res) => {
    try {
     
      if (req.user.userRole !== "user") {
        return res.status(403).json({ message: "Only users can access wishlist" });
      }
  
      
      const wishlist = await Wishlist.findOne({ userId: req.user.userId });
  
      if (!wishlist) {
        return res.status(404).json({ message: "No wishlist found for this user" });
      }
  

      const products = await Product.find({ productId: { $in: wishlist.products } })
        .select("productId name price image category");
  
      res.status(200).json({
        wishlist: {
          userId: wishlist.userId,
          totalItems: wishlist.products.length,
          products
        }
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
  

export default router;
