import express from "express"
import cors from "cors"
import http from "http"
import dotevn from "dotenv"
import { connectDB } from "./lib/db.js"
import userRouter from "./routes/userRouter.js"
import messageRouter from "./routes/messageRoutes.js"
import {Server} from "socket.io"


dotevn.config()
// create express app and http server
const app= express()
const server = http.createServer(app)

// initialize socket.io server

export const io = new Server(server, {
    cors: { origin: "*" }
});

// store online users
export const userSocketMap = {}; // {userId: socketId}

// socket.io connection handler  
io.on("connection", (socket) => { // Fixed typo: "connnection" -> "connection"
    const userId = socket.handshake.query.userId;
    console.log(`user connected ${userId}`);
    
    if (userId) {
        userSocketMap[userId] = socket.id; // Fixed: should be socket.id, not socket.userId
    }
    
    // Emit online users to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    
    socket.on("disconnect", () => {
        console.log("user disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// middlewares
app.use(cors())
app.use(express.json({limit:'4mb'}))

// routes setup
app.use("/api/auth",userRouter)
app.use("/api/messages",messageRouter)

//  connect with database
connectDB()

app.use("/api/status",(req,res)=>res.send("server is running"))
 
if(process.env.Node_ENV !=="production"){
    const port =process.env.PORT || 300
    server.listen(port,()=>console.log("server is running")
    )

}

export default server