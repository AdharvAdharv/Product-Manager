import dotenv from "dotenv";
import express,{json} from 'express';
import { userauth } from "./Routes/Auth.js";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { sample } from './Models/model.js';

import productRoutes from "./Routes/productRoutes.js";
import wishlistRoutes from "./Routes/wishlistRoutes.js";



dotenv.config();

const app=express();

 app.use(cors({
    origin:'http://127.0.0.1:5501',
    credentials:true
 }))
 app.use(json())
 app.use('/uploads', express.static('uploads'));

app.use('/',userauth)  

app.use('/api/products', productRoutes)
app.use('/api/wishlist', wishlistRoutes)





// mongodb 

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('MongoDB connected successfully to ProductManager');
})
    .catch((error)=>{
        console.error('MondoDB connection failed :',error);
        
    })

    

const createAdminUser = async () => {
  try {
    
    const existingAdmin = await sample.findOne({ userRole: "admin" });
    if (!existingAdmin) {
      
      const hashedPassword = await bcrypt.hash("admin123", 10);

     
      const newAdmin = new sample({
        name: "Admin",
        email: "admin@system.com",
        password: hashedPassword,
        userRole: "admin",
        userId: "ADMIN01",
      });

      await newAdmin.save();
      console.log("Admin user created: admin@system.com / admin123");
    } else {
      console.log("Admin already exists");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};


createAdminUser();


    

app.listen(process.env.PORT,function(){
    console.log(`service is listening at ${process.env.PORT}`);
    });

 

