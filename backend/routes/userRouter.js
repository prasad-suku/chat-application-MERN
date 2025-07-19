import express from "express"
import { checkAuth, Login, signUp, updateProfile } from "../controllers/userController.js"
import { protectedRoute } from "../middleware/auth.js"
const userRouter = express.Router()

userRouter.post("/register",signUp)
userRouter.post("/login",Login)
userRouter.put("/update-profile",protectedRoute,updateProfile)
userRouter.get("/check",protectedRoute,checkAuth)

export default userRouter;