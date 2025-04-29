import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sample } from "../Models/model.js";
import { body, validationResult } from "express-validator";

import { Product } from "../Models/Product.js";
import upload from "../Middleware/multerConfig.js";
import { jwtAuthMiddleware } from "../Middleware/AuthMiddleware.js";


const userauth = Router();

userauth.post("/signup",[
    
    body("name").isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
   
    body("email").isEmail().withMessage("Invalid email address"),
    
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
  ], async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
     
      return res.status(400).json({ errors: errors.array() });
    }
  try {
    const { name, email, password } = req.body;

    
    const existingUser = await sample.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return res.status(400).send("User already exists");
    }

    
    const lastUser = await sample.findOne({ userRole: "user" }).sort({ createdAt: -1 });

    let newUserId = "USER001";
    if (lastUser && lastUser.userId) {
      const lastIdNum = parseInt(lastUser.userId.slice(4));
      const nextIdNum = lastIdNum + 1;
      newUserId = "USER" + String(nextIdNum).padStart(3, "0");
    }

   
    const newPassword = await bcrypt.hash(password, 10);

   
    const newUser = new sample({
      name,
      email,
      password: newPassword,
      userRole: "user", 
      userId: newUserId,
    });

    await newUser.save();

    res.status(201).send("Signed up successfully");
    console.log("Signed up successfully");

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});




userauth.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      
      const user = await sample.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email" });
      }
  
     
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }
  
    
      const token = jwt.sign(
        {
          userId: user.userId,
          userRole: user.userRole,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
  
     
      res.status(200).json({
        message: "Logged in successfully",
        token: token,
      });
  
      console.log(`User ${user.userId} logged in successfully`);
  
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });



  

export { userauth };
