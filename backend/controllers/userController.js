
// signup a new user

import { generateToken } from "../lib/utils.js";
import { User } from "../models/User.js";
import bcrypt from "bcrypt"
import cloudinary from "../lib/cloudinary.js"

export const signUp = async(req,res)=>{
    const {fullName,email,password} =req.body;
    try {
         if(!fullName || !email || !password){
            return res.status(400).json({success:false,message:"Missing details"})
         }
          const isUserExist = await User.findOne({email})

          if(isUserExist){
            return res.status(400).json({success:false,message:"User already exists"})
          }
         
       
          const salt = await  bcrypt.genSalt(10);
          const hashedPassword= await bcrypt.hash(password,salt)

        //   create a new user
          const newUser  = await User.create({
            fullName,
            email,
            password:hashedPassword
          })
         
        //   user token generation
        const token=  generateToken(newUser._id)
        res.json({
            success:true,
            message:"Successfully signed up",
            userdata:newUser,
            token
        })
    } catch (error) {
        console.log(error.message);
        
        res.json({success:false,message:`Error signing up ${error.message} `})
    }
}



// controller to login a user

export const Login = async(req,res)=>{
   const  {password,email}= req.body

   const userData =await User.findOne({email})
      if(!userData){
        return res.status(404).json({success:false,message:"User not found"})
      }
   const isPasswordMatch = await bcrypt.compare(password,userData.password)
   if(!isPasswordMatch){
    return res.status(400).json({success:false,message:"Invalid credentials"})

   }
   const token = generateToken(userData._id)
   res.json({success:true,message:"Login successful",userData,token})
}


//   controller to check if user is authenticated

export const checkAuth = (req,res)=>{
     res.json({success:true,user:req.user})
}

// controller to update user profile details

export const updateProfile = async (req,res)=>{
  try{
    const {profilePicture,fullName}  = req.body;

  const userId=req.user._id;
  let updatedUser;

  if(!profilePicture){
    updatedUser = await User.findByIdAndUpdate(userId,{fullName},{new:true})
  }else{
     
    const upload  = await cloudinary.uploader.upload(profilePicture)
    
    updatedUser= await User.findByIdAndUpdate(userId,{profilePicture:upload.secure_url,fullName},{new:true})
  }
   res.json({success:true,user:updatedUser})

  }
  catch(error){
    console.log(error.message);
    res.json({success:false,message:error.message})
  }
}