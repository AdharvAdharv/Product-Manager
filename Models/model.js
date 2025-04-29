import {Schema}  from "mongoose";
import {model} from "mongoose";

const demo = new Schema({
    name:{type:String,required:true},
    email:{type:String,reqiured:true,unique:true},
    password:{type:String,required:true},
    userRole:{type:String,reqiured:true},
    userId:{type:String,reqiured:true}
});
const sample=model ('user', demo)
export  {sample};