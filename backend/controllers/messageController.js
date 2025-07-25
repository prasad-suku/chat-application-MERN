 import  {Message}  from "../models/Message.js";
import {User}  from "../models/User.js"
import cloudinary from "../lib/cloudinary.js";
import {io,userSocketMap} from "../server.js"
 // get all users name expect the logged in user (current user)
 export const getUserForSidebar = async(req,res)=>{
   try{
       const userId= req.user._id;
       // $ne - not equal to userID expect current user & then .select(-password) method will remove password property 
       const filteredUsers = await User.find({_id:{$ne:userId}}).select("-password") 
     
       // count number of messages not seen
       const unseenMessage = {}

       const promises=filteredUsers.map( async(user)=>{
        // get all unseen messages from messaages collection
        const messages = await Message.find({senderId:user._id,receivedId:userId,seen:false})
        if(messages.length>0){
          unseenMessage[user._id] = messages.length;
        }
       })
    
      //  execute promises 
       await Promise.all(promises);
       res.json({success:true,users:filteredUsers,unseenMessage})
   }
   catch(error){
    console.log(error.message);
      res.json({success:false,message:error.message})
    
   }
 }


//  get all messages for selected user

export const getMessage = async(req,res)=>{
  try {
     
    const {id:selectedUserId} = req.params;
    
    const myId = req.user._id;

    const messages = await Message.find({
      $or:[
        {senderId:myId,receiverId:selectedUserId},
        {senderId:selectedUserId,receiverId:myId},
      ]
    })

    await Message.updateMany({senderId:selectedUserId,receiverId:myId},{seen:true})
   res.json({success:true,messages})
  } catch (error) {
    console.log(error.message);
    res.json({success:false,message:error.message})
  }
}


// api to mark message as seen using message id
export const markMessageAsSeen =async(req,res)=>{
  try {
     const {id}= req.params
     await Message.findByIdAndUpdate(id,{seen:true})
     res.json({success:true})
  } catch (error) {
       console.log(error.message);
       res.json({success:false,message:error.message})
       
  }
}


// send message to selected user
export const sendMessage = async(req,res)=>{
   
  try {
     const {text,image} = req.body;
     const receiverId = req.params.id;
     const senderId =  req.user._id; 

     let imageUrl;
     if(image){
      const upload =await cloudinary.uploader.upload(image)
      imageUrl = upload.secure_url
     }

     const newMessage = await Message.create({
      senderId,receiverId,text,image:imageUrl
     })
      // emit the new message to the receiver's socket
      const receiverSocketId = userSocketMap[receiverId]
      if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage",newMessage)
      }
          
     res.json({success:true,newMessage})
  } catch (error) {
       console.log(error.message);
       res.json({success:false,message:error.message})
  }
}