import mongoose from "mongoose"
 
// connect mongoose to the database

export const connectDB = async ()=>{

   try{
     await mongoose.connect(`${process.env.MONGODBURI}/chat-app`)
      console.log("mongodb connected successfully");

    } catch (error) {
        console.error("Error connecting to mongodb:", error);
    }
}