import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./Authcontext";
import toast from "react-hot-toast";


export const ChatContext = createContext()

export const ChatProvider = ({children})=>{
    
    const [messages,setMesages] =useState([])
    const [users,setUsers] = useState([])
    const [selectedUser,setSelectedUser]=useState(null)
    const [unseenMessages,setUnseenMessages] = useState({})

    const {socket,axios}=useContext(AuthContext);
    
// function to get all users for sidebar
   
  const getUsers =async()=>{
    try {
      const {data} =   await axios.get("/api/messages/users")
      if(data.success){
        setUsers(data.users)
        setUnseenMessages(data.unseenMessage)
      }
    } catch (error) {
        console.log(error.message);
        toast.error(error.message)
    }
  }

//   function to get messages for the selected user 
  
  const getMessages = async(userId)=>{
      try {
        const {data} = await axios.get(`/api/messages/${userId}`)
        if(data.success){
            setMesages(data.messages)
        }
      } catch (error) {
        toast.error(error.message)
        
      }
  }

//   function to send message to the selected user
   const sendMessage = async(message)=>{
      try {
        const {data} = await axios.post(`/api/messages/${selectedUser._id}`,message)
     if(data.success){
        setMesages((prev)=>[...prev,data.message])
     } 
     else{
        toast.error(data.message)
     }
    } catch (error) {
        toast.error(error.message)
      }
   }

//    function to subsribe to message for selected user
 const subscribeToMessages= async()=>{
      if(!socket) return;
       
      socket.on("newMessage",(newMessage)=>{
        if(selectedUser && newMessage.senderId ===selectedUser._id){
            newMessage.seen=true;
            setMesages((pre)=>[...pre,newMessage])
            axios.put("/api/messages/mark/${newMessage._id}")
        }
        else{
            setUnseenMessages((prevUnseenMessages)=>({
                ...prevUnseenMessages,[newMessage.senderId]:prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId]+1:1
            }))
        }
      })
 }   
//  function to unsubscribe from messages
      const unsubscribeFromMessages= ()=>{
        if(socket) socket.off("newMessage")
      }

      useEffect(()=>{
          subscribeToMessages()
          return ()=> unsubscribeFromMessages()
      },[socket,selectedUser])


    const value = {
       messages,users,selectedUser,getUsers,setMesages,sendMessage,setSelectedUser,unseenMessages,setUnseenMessages
    }
    return  (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}