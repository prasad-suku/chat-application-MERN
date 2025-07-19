import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    

    email:{type:String,required:true,unique:true},
    fullName:{type:String,required:true},
    password:{type:String,required:true,minlength:6},
    profilePicture:{type:String,default:""}
},{timestamps:true})


export const User = mongoose.model("User",UserSchema)