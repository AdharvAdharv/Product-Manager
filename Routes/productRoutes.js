import express from "express";
import { Product } from "../Models/Product.js";
import upload from "../Middleware/multerConfig.js";
import { jwtAuthMiddleware } from "../Middleware/AuthMiddleware.js";

const router = express.Router();


router.post(
  "/add",
  jwtAuthMiddleware("any"), 
  upload.single("image"), 
  async (req, res) => {
    try {
      const { name, description, price, category } = req.body;

      
      const lastProduct = await Product.findOne().sort({ createdAt: -1 });
      let newProductId = "PROD001";
      if (lastProduct && lastProduct.productId) {
        const lastIdNum = parseInt(lastProduct.productId.slice(4));
        const nextIdNum = lastIdNum + 1;
        newProductId = "PROD" + String(nextIdNum).padStart(3, "0");
      }

     
      const newProduct = new Product({
        productId: newProductId,
        name,
        description,
        price,
        category,
        image: `/uploads/public/product/${req.file.filename}`,
        ownerId: req.user.userId, 
      });

      await newProduct.save();

      res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);


router.get("/all", async (req, res) => {
  try {
    
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    
    const totalProducts = await Product.countDocuments();

    
    const products = await Product.find({})
      .select("name price image")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      products
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


router.put(
  "/update/:productId",
  jwtAuthMiddleware("any"),
  upload.single("image"), 
  async (req, res) => {
    try {
      const { productId } = req.params;
      const { name, description, price, category } = req.body;

     
      const product = await Product.findOne({ productId });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      
      if (req.user.userId !== product.ownerId && req.user.userRole !== "admin") {
        return res.status(403).json({ message: "Unauthorized access" });
      }

     
      if (name) product.name = name;
      if (description) product.description = description;
      if (price) product.price = price;
      if (category) product.category = category.toLowerCase();
      if (req.file) {
        product.image = `/uploads/public/product/${req.file.filename}`;
      }

      await product.save();

      res.status(200).json({ message: "Product updated successfully", product });

    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);



router.delete(
  "/delete/:productId",
  jwtAuthMiddleware("any"),
  async (req, res) => {
    try {
      const { productId } = req.params;

      
      const product = await Product.findOne({ productId });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      
      if (req.user.userId !== product.ownerId && req.user.userRole !== "admin") {
        return res.status(403).json({ message: "Unauthorized access" });
      }

      
      await Product.deleteOne({ productId });

      res.status(200).json({ message: "Product deleted successfully" });

    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);



router.get("/detail/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

  
    res.status(200).json({ product });

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});



router.get("/search", async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sortBy, page } = req.query;

    const query = {};

    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { productId: { $regex: search, $options: "i" } }
      ];
    }

 
    if (category) {
      query.category = category.toLowerCase();
    }

   
    if (minPrice && maxPrice) {
      query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    }

   
    const limit = 5;
    const currentPage = parseInt(page) || 1;
    const skip = (currentPage - 1) * limit;

    
    let sortOption = {};
    if (sortBy === "price") sortOption.price = 1;
    if (sortBy === "name") sortOption.name = 1;
    if (sortBy === "date") sortOption.createdAt = -1;

    
    const totalProducts = await Product.countDocuments(query);

    
    const products = await Product.find(query)
      .select("name price image productId")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      totalProducts,
      currentPage,
      totalPages: Math.ceil(totalProducts / limit),
      products
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


export default router;
